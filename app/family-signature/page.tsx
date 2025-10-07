import { FamilySignatureForm } from "@/components/family-signature-form"
import { DataStorageService } from "@/services/data-storage-service"

export default function FamilySignaturePage() {
  return (
    <div className="container mx-auto py-8">
      <FamilySignatureForm userId="sample-user" userName="サンプル利用者" />
    </div>
  )
}
