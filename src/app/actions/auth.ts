"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signUpSchema } from "@/lib/validations";
import { isAdminEmail } from "@/lib/env";
import { z } from "zod";

export async function signUp(data: z.infer<typeof signUpSchema>) {
  const validated = signUpSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { name, email, password } = validated.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      // Emails in the ADMIN_EMAILS allowlist are granted super-admin on signup
      role: isAdminEmail(email) ? "ADMIN" : "USER",
    },
  });

  return { success: true, userId: user.id };
}

export async function saveOnboarding(userId: string, data: {
  businessName: string;
  website?: string;
  businessType: string;
  mainOffer: string;
  averageDealValue: number;
  idealCustomerProfile: string;
  badFitTraits?: string;
  currentLeadSources: string[];
  currentCRM?: string;
  toneOfVoice?: string;
  approvalPreference?: string;
  leadScoringPriorities?: string;
}) {
  const existingMembership = await prisma.companyMember.findFirst({
    where: { userId },
  });

  if (existingMembership) {
    await prisma.company.update({
      where: { id: existingMembership.companyId },
      data: {
        name: data.businessName,
        website: data.website,
        businessType: data.businessType,
        mainOffer: data.mainOffer,
        averageDealValue: data.averageDealValue,
        idealCustomerProfile: data.idealCustomerProfile,
        badFitTraits: data.badFitTraits,
        leadSources: data.currentLeadSources,
        currentCRM: data.currentCRM,
        toneOfVoice: data.toneOfVoice,
        approvalPreference: data.approvalPreference,
        leadScoringPriorities: data.leadScoringPriorities,
        setupStatus: "CONFIGURING",
      },
    });
    return { success: true };
  }

  const company = await prisma.company.create({
    data: {
      name: data.businessName,
      website: data.website,
      businessType: data.businessType,
      mainOffer: data.mainOffer,
      averageDealValue: data.averageDealValue,
      idealCustomerProfile: data.idealCustomerProfile,
      badFitTraits: data.badFitTraits,
      leadSources: data.currentLeadSources,
      currentCRM: data.currentCRM,
      toneOfVoice: data.toneOfVoice,
      approvalPreference: data.approvalPreference,
      leadScoringPriorities: data.leadScoringPriorities,
      setupStatus: "CONFIGURING",
      members: {
        create: { userId, role: "USER" },
      },
    },
  });

  await prisma.agent.create({
    data: {
      companyId: company.id,
      name: "Lead Research Agent",
      type: "LEAD_RESEARCH",
      description: "Researches and scores incoming leads",
      status: "ACTIVE",
    },
  });

  return { success: true };
}
