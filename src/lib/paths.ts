export function withBasePath(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (!basePath || !path.startsWith("/")) {
    return path;
  }

  return `${basePath}${path}`;
}
