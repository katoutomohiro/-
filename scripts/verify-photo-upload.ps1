# 写真アップロード機能の自動検証スクリプトを実行してください

# タスク1: コードレビュー - 写真アップロード機能が正しく実装されているか確認
Write-Host "=== タスク1: コードレビュー ===" -ForegroundColor Cyan
# 写真アップロード機能の自動検証スクリプトを実行してください

# タスク1: コードレビュー - 写真アップロード機能が正しく実装されているか確認
# 写真アップロード機能の自動検証スクリプト

Write-Host "=== タスク1: コードレビュー ===" -ForegroundColor Cyan

# 1.1 PhotoUploadコンポーネントが存在するか確認
if (Test-Path "components/photo-upload.tsx") {
    Write-Host "✓ PhotoUploadコンポーネントが存在します" -ForegroundColor Green
} else {
    Write-Host "✗ PhotoUploadコンポーネントが見つかりません" -ForegroundColor Red
}

# 1.2 PhotoGalleryコンポーネントが存在するか確認
if (Test-Path "components/photo-gallery.tsx") {
    Write-Host "✓ PhotoGalleryコンポーネントが存在します" -ForegroundColor Green
} else {
    Write-Host "✗ PhotoGalleryコンポーネントが見つかりません" -ForegroundColor Red
}

# 1.3 seizure-form.tsxにPhotoUploadがインポートされているか確認
if (Test-Path "components/forms/seizure-form.tsx") {
    $seizureForm = Get-Content "components/forms/seizure-form.tsx" -Raw
    if ($seizureForm -match "import.*PhotoUpload") {
        Write-Host "✓ seizure-form.tsxにPhotoUploadがインポートされています" -ForegroundColor Green
    } else {
        Write-Host "✗ seizure-form.tsxにPhotoUploadがインポートされていません" -ForegroundColor Red
    }
} else {
    Write-Host "✗ components/forms/seizure-form.tsx が見つかりません" -ForegroundColor Red
}

# 1.4 CareEventインターフェースにphotosフィールドがあるか確認
if (Test-Path "services/data-storage-service.ts") {
    $dataService = Get-Content "services/data-storage-service.ts" -Raw
    if ($dataService -match "photos\?:\s*string\[\]") {
        Write-Host "✓ CareEventインターフェースにphotosフィールドがあります" -ForegroundColor Green
    } else {
        Write-Host "✗ CareEventインターフェースにphotosフィールドがありません" -ForegroundColor Red
    }
} else {
    Write-Host "✗ services/data-storage-service.ts が見つかりません" -ForegroundColor Red
}

Write-Host "`n=== タスク2: ビルドとテスト ===" -ForegroundColor Cyan

Write-Host "型チェックを実行中..." -ForegroundColor Yellow
pnpm tsc --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 型チェック成功" -ForegroundColor Green
} else {
    Write-Host "✗ 型チェック失敗" -ForegroundColor Red
}

Write-Host "ビルドを実行中..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ ビルド成功" -ForegroundColor Green
} else {
    Write-Host "✗ ビルド失敗" -ForegroundColor Red
}

Write-Host "`n=== 検証結果サマリ ===" -ForegroundColor Cyan
Write-Host "写真アップロード機能の実装状況を報告しました。"
