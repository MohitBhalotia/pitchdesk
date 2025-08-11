"use client"

import { Suspense } from "react"
import ResetPasswordPreview from "./ResetPasswordPreview"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPreview />
    </Suspense>
  )
}
