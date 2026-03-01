$body = @{
    message = "Hello, can you help me with my studies?"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body $body

$response | ConvertTo-Json
