# Transform data_tenant1.csv for all 4 reps
# Rep 1: North, Rep 2: South, Rep 3: East+Central, Rep 4: West

$csv = Import-Csv "C:\Users\Lenovo\Desktop\Prototype\cross_demo\cross_demo\src\data\data_tenant1.csv"

Write-Output "Processing $($csv.Count) deals from data_tenant1..."

# Helper functions
function Format-Crores($value) {
    $crores = [math]::Round([double]$value / 10000000, 2)
    return "₹$crores Cr"
}

function Get-DaysToClose($closeDate) {
    try {
        $close = [DateTime]::Parse($closeDate)
        $today = Get-Date "2026-03-13"
        $days = [math]::Max(0, ($close - $today).Days)
        return $days
    }
    catch {
        return 30
    }
}

function Get-DealStage($orderType, $days) {
    switch ($orderType) {
        "New" { 
            if ($days -lt 30) { return "Negotiation" }
            elseif ($days -lt 60) { return "Proposal" }
            else { return "Qualification" }
        }
        "AMC" { return "Proposal" }
        "Renewal" { return "Negotiation" }
        default { return "Qualification" }
    }
}

function Get-DealStatus($margin, $days) {
    $marginVal = [double]$margin
    if ($marginVal -lt 15) { return "critical" }
    elseif ($marginVal -lt 25) { return "at-risk" }
    elseif ($days -le 10) { return "high-risk" }
    else { return "healthy" }
}

function Format-Deal($deal, $id, $repId, $repName, $region, $manager) {
    $value = [math]::Round([double]$deal.ProjectValue / 10000000, 2)
    $closeDate = Get-Date $deal.ClosureDate -Format "MMM dd, yyyy" -ErrorAction SilentlyContinue
    if (-not $closeDate) { $closeDate = "Dec 31, 2026" }
    $daysToClose = Get-DaysToClose $deal.ClosureDate
    $stage = Get-DealStage $deal.OrderType $daysToClose
    $status = Get-DealStatus $deal.'Margin%' $daysToClose
    $engagementScore = Get-Random -Minimum 50 -Maximum 96
    $stakeholders = Get-Random -Minimum 1 -Maximum 6
    
    $name = "$($deal.ServiceLine) - $($deal.'Service (Offer)')"
    
    return @"
  {
    id: $id,
    name: '$name',
    company: '$($deal.AccountName)',
    value: $value,
    valueFormatted: '$(Format-Crores $deal.ProjectValue)',
    stage: '$stage',
    closeDate: '$closeDate',
    daysToClose: $daysToClose,
    repId: $repId,
    repName: '$repName',
    region: '$region',
    manager: '$manager',
    status: '$status',
    margin: $([math]::Round([double]$deal.'Margin%', 2)),
    industry: '$($deal.Industry)',
    sector: '$($deal.Sector)',
    technology: '$($deal.Technology)',
    partner: '$($deal.Partner)',
    engagementScore: $engagementScore,
    stakeholders: $stakeholders
  }
"@
}

# Process each region
$output = @"
// REAL DATA from data_tenant1.xlsx (199 deals)
// Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
// Distribution: North (Rep 1), South (Rep 2), East+Central (Rep 3), West (Rep 4)

export const allDeals = [
"@

$dealId = 1

# Rep 1: North Region (Rahul Sharma) - Top 12 deals
Write-Output "Processing Rep 1 (Rahul Sharma - North)..."
$northDeals = $csv | Where-Object { $_.SalesRegion -eq 'North' } | 
    Sort-Object { [double]$_.ProjectValue } -Descending | 
    Select-Object -First 12

foreach ($deal in $northDeals) {
    $output += "`n" + (Format-Deal $deal $dealId 1 "Rahul Sharma" "North" "Rajesh Kumar") + ","
    $dealId++
}

# Rep 2: South Region (Priya Mehta) - Top 12 deals
Write-Output "Processing Rep 2 (Priya Mehta - South)..."
$southDeals = $csv | Where-Object { $_.SalesRegion -eq 'South' } | 
    Sort-Object { [double]$_.ProjectValue } -Descending | 
    Select-Object -First 12

foreach ($deal in $southDeals) {
    $output += "`n" + (Format-Deal $deal $dealId 2 "Priya Mehta" "South" "Rajesh Kumar") + ","
    $dealId++
}

# Rep 3: East+Central Region (Amit Kumar) - All 8 East + Top 4 Central = 12 deals
Write-Output "Processing Rep 3 (Amit Kumar - East+Central)..."
$eastDeals = $csv | Where-Object { $_.SalesRegion -eq 'East' } | 
    Sort-Object { [double]$_.ProjectValue } -Descending
$centralDeals = $csv | Where-Object { $_.SalesRegion -eq 'Central' } | 
    Sort-Object { [double]$_.ProjectValue } -Descending | 
    Select-Object -First 4
$rep3Deals = $eastDeals + $centralDeals

foreach ($deal in $rep3Deals) {
    $output += "`n" + (Format-Deal $deal $dealId 3 "Amit Kumar" "East" "Priya Sharma") + ","
    $dealId++
}

# Rep 4: West Region (Neha Singh) - Top 12 deals
Write-Output "Processing Rep 4 (Neha Singh - West)..."
$westDeals = $csv | Where-Object { $_.SalesRegion -eq 'West' } | 
    Sort-Object { [double]$_.ProjectValue } -Descending | 
    Select-Object -First 12

foreach ($deal in $westDeals) {
    $output += "`n" + (Format-Deal $deal $dealId 4 "Neha Singh" "West" "Priya Sharma") + ","
    $dealId++
}

# Remove last comma and close array
$output = $output.TrimEnd(',')
$output += @"

];

// Total: $($dealId - 1) deals
// Rep 1 (North): 12 deals
// Rep 2 (South): 12 deals  
// Rep 3 (East+Central): 12 deals
// Rep 4 (West): 12 deals
"@

# Save to file
$output | Out-File "C:\Users\Lenovo\Desktop\Prototype\cross_demo\cross_demo\src\data\all_deals_output.txt" -Encoding UTF8

Write-Output ""
Write-Output "Generated $($dealId - 1) deals successfully!"
Write-Output "Output saved to: all_deals_output.txt"
