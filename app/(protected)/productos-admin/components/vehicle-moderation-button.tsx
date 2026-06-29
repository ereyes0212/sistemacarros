"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { VehicleModerationState } from "../actions";

const initialState: VehicleModerationState = { ok: false, message: "" };

function SubmitButton({ label, variant }: { label: string; variant?: "outline" }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" variant={variant} disabled={pending}>
      {pending ? "Procesando..." : label}
    </Button>
  );
}

export function VehicleModerationButton({
  action,
  label,
  variant,
}: {
  action: (state: VehicleModerationState, formData: FormData) => Promise<VehicleModerationState>;
  label: string;
  variant?: "outline";
}) {
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction}>
      <SubmitButton label={label} variant={variant} />
    </form>
  );
}
