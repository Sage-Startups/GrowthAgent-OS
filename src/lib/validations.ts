import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const onboardingSchema = z.object({
  businessName: z.string().min(2, "Business name required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  businessType: z.string().min(1, "Business type required"),
  mainOffer: z.string().min(10, "Please describe your main offer"),
  averageDealValue: z.number().min(0),
  idealCustomerProfile: z.string().min(10, "Please describe your ideal customer"),
  badFitTraits: z.string().optional(),
  currentLeadSources: z.array(z.string()),
  currentCRM: z.string().optional(),
  toneOfVoice: z.string().optional(),
  approvalPreference: z.string().optional(),
  leadScoringPriorities: z.string().optional(),
});

export const demoRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  website: z.string().optional(),
  leadVolume: z.string(),
  businessType: z.string(),
  currentCRM: z.string().optional(),
  painPoint: z.string().min(10),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
