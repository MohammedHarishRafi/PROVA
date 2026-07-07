import asyncio
import sys

async def main():
    p = await asyncio.create_subprocess_shell(
        r'"C:\Users\ST-Sivaranjini\Downloads\java_convertion 4\apache-maven-3.9.6\bin\mvn.cmd" jetty:run -Djetty.http.port=8090',
        cwd=r'C:\Users\ST-Sivaranjini\Downloads\java_convertion 4\python_backend\workspace\spring-framework-petclinic',
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT
    )
    stdout, _ = await p.communicate()
    print(stdout.decode('utf-8'))

asyncio.run(main())
