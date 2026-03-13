# Convert Excel to CSV and analyze data

$excelPath = "C:\Users\Lenovo\Desktop\Prototype\cross_demo\cross_demo\src\data\data_tenant1.xlsx"
$csvPath = "C:\Users\Lenovo\Desktop\Prototype\cross_demo\cross_demo\src\data\data_tenant1.csv"

Write-Output "Converting Excel to CSV..."

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    $workbook = $excel.Workbooks.Open($excelPath)
    $worksheet = $workbook.Worksheets.Item(1)
    
    # Save as CSV
    $worksheet.SaveAs($csvPath, 6)
    
    $workbook.Close($false)
    $excel.Quit()
    
    # Release COM objects
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($worksheet) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Output "✓ Conversion successful!"
    
    # Now analyze the CSV
    if (Test-Path $csvPath) {
        $csv = Import-Csv $csvPath
        Write-Output "`nData Analysis:"
        Write-Output "Total rows: $($csv.Count)"
        Write-Output "`nColumn names:"
        $csv[0].PSObject.Properties.Name | ForEach-Object { Write-Output "  - $_" }
        
        # Check for region column
        if ($csv[0].PSObject.Properties.Name -contains 'salesregion') {
            Write-Output "`nRegional distribution:"
            $csv | Group-Object -Property salesregion | ForEach-Object {
                Write-Output "  $($_.Name): $($_.Count) deals"
            }
        }
    }
}
catch {
    Write-Output "Excel COM failed: $_"
    Write-Output "Please close Excel if it is open and try again."
}
