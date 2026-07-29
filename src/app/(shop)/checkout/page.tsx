"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Loader2, CreditCard, Truck, Shield, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  updateCart,
  getCart,
  listShippingOptions,
  setShippingMethod,
  listPaymentProviders,
  createPaymentCollection,
  ensurePaymentSession,
  completeCart,
  getRegions,
  type MedusaShippingOption,
  type MedusaPaymentProvider,
  type MedusaPaymentCollection,
  type MedusaOrder,
  type MedusaRegion,
  type MedusaCompleteCartResponse,
} from "@/lib/api";

const addressSchema = z.object({
  email: z.string().email("Enter a valid email"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  address: z.string().min(3, "Required"),
  city: z.string().min(1, "Required"),
  zip: z.string().min(3, "Required"),
  country: z.string().regex(/^[a-zA-Z]{2}$/, "Select a valid country"),
});

type AddressForm = z.infer<typeof addressSchema>;

const steps = ["Information", "Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const { items, cartId, clear, sync, pendingMutations } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(0);
  const [addressSaved, setAddressSaved] = useState(false);

  const [regions, setRegions] = useState<MedusaRegion[]>([]);
  const [shippingOptions, setShippingOptions] = useState<MedusaShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentProviders, setPaymentProviders] = useState<MedusaPaymentProvider[]>([]);
  const [paymentCollection, setPaymentCollection] = useState<MedusaPaymentCollection | null>(null);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string | null>(null);
  const [order, setOrder] = useState<MedusaOrder | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [regionId, setRegionId] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingCost;

  const availableCountries = regions.flatMap((r) =>
    r.countries.map((c) => ({ code: c.iso_2, name: c.name, regionId: r.id })),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "" },
  });

  useEffect(() => {
    getRegions().then(setRegions).catch(console.error);
  }, []);

  const loadShippingOptions = useCallback(async () => {
    if (!cartId) return;
    setLoadingShipping(true);
    setError(null);
    try {
      const options = await listShippingOptions(cartId);
      setShippingOptions(options);
      if (options.length === 1) {
        setSelectedShipping(options[0].id);
        setShippingCost(options[0].amount);
        await setShippingMethod(cartId, options[0].id);
      }
    } catch (err) {
      setError("Failed to load shipping options.");
    } finally {
      setLoadingShipping(false);
    }
  }, [cartId]);

  const loadPaymentProviders = useCallback(async () => {
    if (!regionId) return;
    setLoadingPayment(true);
    setError(null);
    try {
      const providers = await listPaymentProviders(regionId);
      setPaymentProviders(providers.filter((p) => p.is_enabled));
    } catch {
      setError("Failed to load payment methods.");
    } finally {
      setLoadingPayment(false);
    }
  }, [regionId]);

  useEffect(() => {
    if (regionId) loadPaymentProviders();
  }, [regionId, loadPaymentProviders]);

  const onAddressSubmit = async (data: AddressForm) => {
    if (!cartId) return;
    await pendingMutations();
    setLoading(true);
    setError(null);
    try {
      const country = availableCountries.find((c) => c.code === data.country);
      const selectedRegionId = country?.regionId;
      setRegionId(selectedRegionId ?? null);
      await updateCart(cartId, {
        region_id: selectedRegionId,
        email: data.email,
        shipping_address: {
          first_name: data.firstName,
          last_name: data.lastName,
          address_1: data.address,
          city: data.city,
          postal_code: data.zip,
          country_code: data.country,
        },
      });
      setAddressSaved(true);
      setStep(1);
      loadShippingOptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSelect = async (optionId: string) => {
    if (!cartId) return;
    await pendingMutations();
    setSelectedShipping(optionId);
    const option = shippingOptions.find((o) => o.id === optionId);
    setShippingCost(option ? option.amount : 0);
    try {
      await setShippingMethod(cartId, optionId);
    } catch {
      setError("Failed to set shipping method.");
    }
  };

  const handlePaymentProviderSelect = async (providerId: string) => {
    if (!cartId) return;
    await pendingMutations();
    setSelectedPaymentProvider(providerId);
    setLoadingPayment(true);
    setError(null);
    try {
      const { collection } = await ensurePaymentSession(cartId, providerId);
      setPaymentCollection(collection);
      setStep(3);
    } catch {
      setError("Failed to initialize payment.");
      setSelectedPaymentProvider(null);
      setPaymentCollection(null);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cartId || !selectedPaymentProvider) return;
    await pendingMutations();
    setLoading(true);
    setError(null);
    try {
      await sync();
      const currentCart = await getCart(cartId);
      if (!currentCart.items || currentCart.items.length === 0) {
        setError("Your cart is empty.");
        setLoading(false);
        return;
      }

      const cartWithPayment = await getCart(cartId);
      const hasActiveSession = cartWithPayment.payment_collection?.payment_sessions?.some(
        (s) => s.provider_id === selectedPaymentProvider && s.status === "pending",
      );
      if (!hasActiveSession) {
        await ensurePaymentSession(cartId, selectedPaymentProvider);
      }

      const result: MedusaCompleteCartResponse = await completeCart(cartId);
      if (result.type === "order") {
        setOrder(result.order);
        clear();
      } else {
        setError(result.error?.message || "Failed to place order.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      if (msg.includes("shipping profiles") || msg.includes("shipping methods")) {
        setError("Some items need different shipping. Please go back and select a method that covers all items.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !order) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 md:py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Your bag is empty</h1>
        <p className="max-w-md text-muted-foreground">Add some items before checking out.</p>
        <Button asChild size="lg" className="mt-4"><Link href="/shop">Shop all</Link></Button>
      </div>
    );
  }

  if (order) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 md:py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="size-10 text-success" />
        </div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Order confirmed!</h1>
        <p className="max-w-md text-muted-foreground">
          Thank you for your order! Your order number is{" "}
          <span className="font-medium text-foreground">#{order.display_id}</span>.
          We&apos;ll send a confirmation to{" "}
          <span className="font-medium text-foreground">{order.email}</span>.
        </p>
        <div className="flex gap-3 mt-4">
          <Button asChild size="lg"><Link href="/shop">Continue shopping</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-14">
      {/* Progress Steps */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl mb-6">Checkout</h1>
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex size-7 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                  i <= step ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground",
                  i === step && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                )}>
                  {i < step ? <CheckCircle2 className="size-3.5" /> : i + 1}
                </div>
                <span className={cn(
                  "text-xs font-medium hidden sm:inline",
                  i <= step ? "text-foreground" : "text-muted-foreground",
                )}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("flex-1 h-px mx-3", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Step 0: Address */}
          {step <= 0 && (
            <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-6">
              <Section title="Contact">
                <Field label="Email" error={errors.email?.message}>
                  <Input type="email" {...register("email")} placeholder="you@domain.com" />
                </Field>
              </Section>
              <Section title="Shipping address">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" error={errors.firstName?.message}><Input {...register("firstName")} /></Field>
                  <Field label="Last name" error={errors.lastName?.message}><Input {...register("lastName")} /></Field>
                </div>
                <Field label="Address" error={errors.address?.message}><Input {...register("address")} /></Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="City" error={errors.city?.message}><Input {...register("city")} /></Field>
                  <Field label="ZIP" error={errors.zip?.message}><Input {...register("zip")} /></Field>
                  <Field label="Country" error={errors.country?.message}>
                    {availableCountries.length === 0 ? (
                      <div className="flex h-11 items-center rounded-md border border-border bg-input px-3 text-sm text-muted-foreground">Loading countries...</div>
                    ) : (
                      <select {...register("country")} className="flex h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="">Select country</option>
                        {availableCountries.map((c) => (<option key={c.code} value={c.code}>{c.name}</option>))}
                      </select>
                    )}
                  </Field>
                </div>
              </Section>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Truck className="mr-2 size-5" />}
                {loading ? "Saving..." : "Continue to shipping"}
              </Button>
            </form>
          )}

          {/* Step 1: Shipping */}
          {step === 1 && (
            <Section title="Shipping method">
              {loadingShipping ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading shipping options...</div>
              ) : shippingOptions.length === 0 ? (
                <div className="text-sm text-muted-foreground">No shipping options available for your address.</div>
              ) : (
                <div className="space-y-2">
                  {shippingOptions.map((opt) => (
                    <label key={opt.id} className={cn("flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors", selectedShipping === opt.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted")}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={selectedShipping === opt.id} onChange={() => handleShippingSelect(opt.id)} className="accent-primary" />
                        <div>
                          <div className="text-sm font-medium">{opt.name}</div>
                          <div className="text-xs text-muted-foreground">{opt.provider_id}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{opt.amount === 0 ? "Free" : formatPrice(opt.amount, items[0]?.currency)}</div>
                    </label>
                  ))}
                  <Button size="lg" className="w-full mt-4" onClick={() => setStep(2)} disabled={!selectedShipping}>
                    Continue to payment
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => { setStep(0); setAddressSaved(false); }}>
                    Back to information
                  </Button>
                </div>
              )}
            </Section>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <Section title="Payment method">
              {loadingPayment ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading payment methods...</div>
              ) : paymentProviders.length === 0 ? (
                <div className="text-sm text-muted-foreground">No payment methods available</div>
              ) : (
                <div className="space-y-2">
                  {paymentProviders.map((provider) => (
                    <label key={provider.id} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors", selectedPaymentProvider === provider.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted")}>
                      <input type="radio" name="payment" checked={selectedPaymentProvider === provider.id} onChange={() => handlePaymentProviderSelect(provider.id)} disabled={loadingPayment} className="accent-primary" />
                      <CreditCard className="size-5 text-muted-foreground" />
                      <div className="text-sm font-medium capitalize">{provider.id.replace(/^(pp_|prod_psp_)/, "").replace(/_/g, " ")}</div>
                      {loadingPayment && selectedPaymentProvider === provider.id && <Loader2 className="size-4 animate-spin ml-auto" />}
                    </label>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setStep(1)}>
                    Back to shipping
                  </Button>
                </div>
              )}
            </Section>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <>
              <Section title="Review your order">
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="text-muted-foreground">Shipping method</div>
                    <div className="font-medium">{shippingOptions.find((o) => o.id === selectedShipping)?.name ?? "Standard"}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Payment method</div>
                    <div className="font-medium capitalize">{selectedPaymentProvider?.replace(/^(pp_|prod_psp_)/, "").replace(/_/g, " ") ?? "—"}</div>
                  </div>
                </div>
              </Section>

              <Button size="lg" className="w-full shadow-lg shadow-primary/20" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Lock className="mr-2 size-5" />}
                {loading ? "Placing order..." : `Pay ${formatPrice(total, items[0]?.currency)}`}
              </Button>

              <Button variant="ghost" size="sm" className="w-full" onClick={() => setStep(2)}>
                Back to payment
              </Button>
            </>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Lock className="size-3" />
              Secure checkout
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="size-3" />
              SSL encrypted
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="size-3" />
              Free shipping $60+
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="h-fit rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Order summary</div>
          <ul className="space-y-4">
            {items.map((i) => (
              <li key={i.id} className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface shadow-sm">
                  <Image src={i.image} alt={i.name} fill sizes="64px" className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">{i.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.variantName}</div>
                  <div className="text-sm font-mono mt-1">{formatPrice(i.price * i.quantity, i.currency)}</div>
                </div>
              </li>
            ))}
          </ul>
          <Separator className="my-5" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal, items[0]?.currency)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 && selectedShipping ? "Free" : selectedShipping ? formatPrice(shippingCost, items[0]?.currency) : "Calculated next step"}</span></div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm">Total</span>
            <span className="font-display text-2xl font-bold">{formatPrice(total, items[0]?.currency)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div className="font-display text-xl font-bold">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs text-muted-foreground">{label}</div>
      {children}
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </label>
  );
}
