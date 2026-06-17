import { Fragment } from "react";

import type { ForgotPasswordStep } from "@/components/auth/forgot-password/ForgotPasswordFlow";

const steps: ForgotPasswordStep[] = ["email", "otp", "reset"];

interface ForgotPasswordProgressProps {
  activeStep: ForgotPasswordStep;
}

export function ForgotPasswordProgress({
  activeStep,
}: ForgotPasswordProgressProps) {
  const activeIndex = steps.indexOf(activeStep);

  return (
    <div className="flex items-center w-full mb-10">
      {steps.map((step, index) => {
        const isActive = step === activeStep;
        const isCompleted = activeIndex > index;

        return (
          <Fragment key={step}>
            <div
              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                isActive || isCompleted
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-3 md:mx-4 rounded-full bg-muted overflow-hidden relative">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-500 bg-primary ${
                    isCompleted ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}