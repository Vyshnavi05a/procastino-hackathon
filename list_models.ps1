$apiKey = 'AIzaSyCGYzivNz26ATzQS9cZw-2cpjUYgmk7pn8'
$url = "https://generativelanguage.googleapis.com/v1/models?key=$apiKey"
$response = Invoke-RestMethod -Uri $url -Method GET
$response.models | ForEach-Object { Write-Host "$($_.name) - $($_.displayName)" }
