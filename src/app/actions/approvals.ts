"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function approveRequest(approvalId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  const approval = await prisma.approvalRequest.findUnique({
    where: { id: approvalId },
  });

  if (!approval) return { error: "Approval not found" };

  await prisma.approvalRequest.update({
    where: { id: approvalId },
    data: {
      status: "APPROVED",
      reviewedAt: new Date(),
      reviewedBy: session.user.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: approval.companyId,
      userId: session.user.id,
      action: "APPROVAL_APPROVED",
      entityType: "ApprovalRequest",
      entityId: approvalId,
      metadata: { type: approval.type, title: approval.title },
    },
  });

  revalidatePath("/app/approvals");
  return { success: true };
}

export async function rejectRequest(approvalId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  const approval = await prisma.approvalRequest.findUnique({
    where: { id: approvalId },
  });

  if (!approval) return { error: "Approval not found" };

  await prisma.approvalRequest.update({
    where: { id: approvalId },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedBy: session.user.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: approval.companyId,
      userId: session.user.id,
      action: "APPROVAL_REJECTED",
      entityType: "ApprovalRequest",
      entityId: approvalId,
      metadata: { type: approval.type, title: approval.title },
    },
  });

  revalidatePath("/app/approvals");
  return { success: true };
}
