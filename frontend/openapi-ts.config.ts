import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  client: "legacy/axios",
  input: "./openapi.json",
  output: "./src/client",
  // exportSchemas: true,
  plugins: [
    {
      name: "@hey-api/sdk",
      // NOTE: this doesn't allow tree-shaking
      asClass: true,
      operationId: true,
      methodNameBuilder: (operation) => {
        // @ts-expect-error: operation.name might not exist
        let name: string = operation.name
        // @ts-expect-error: operation.service might not exist
        const service: string = operation.service

        if (service && name.toLowerCase().startsWith(service.toLowerCase())) {
          name = name.slice(service.length)
        }

        return name.charAt(0).toLowerCase() + name.slice(1)
      },
    },
  ],
})
