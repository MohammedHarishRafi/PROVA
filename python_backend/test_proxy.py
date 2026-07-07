import urllib.request
import urllib.error

url = 'http://localhost:5173/api/run/preview/spring-framework-petclinic'
req = urllib.request.Request(url, headers={'Host': 'localhost:5173'})

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Headers:", response.headers)
        print("Body:", response.read().decode('utf-8')[:500])
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print("Headers:", e.headers)
    print("Body:", e.read().decode('utf-8')[:500])
except urllib.error.URLError as e:
    print("URLError:", e.reason)
