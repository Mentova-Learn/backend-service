FROM oven/bun:1

WORKDIR /app

# Install dependencies (cached layer)
COPY package.json bun.lock* ./
RUN bun install

EXPOSE 3000

CMD ["bun", "run", "dev", "--hostname", "0.0.0.0"]
