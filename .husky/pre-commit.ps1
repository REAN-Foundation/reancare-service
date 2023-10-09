#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# $shouldSkipTest = $true
# Write-Host "Skipping tests in the $testFolderPath folder..."
$testFolderPath = "./tests/api-tests/tests/75_clinical.assessment.kobotoolbox.test.ts"
# Write-Host "Skipping tests in the $testFolderPath folder..."
if (Test-Path $testFolderPath -PathType Container) 
{
    Write-Host "Skipping tests in the $testFolderPath folder..."
    exit 0
}

npm test 
# npm test -- --grep '^(?!kobotoolbox|careplan).*'
