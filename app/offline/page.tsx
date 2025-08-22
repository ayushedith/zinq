export default function OfflinePage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-3xl font-semibold">You’re offline</h1>
      <p className="text-muted-foreground max-w-md">
        It looks like you’re not connected. The core QR generator works offline. Some assets may be unavailable until
        you’re back online.
      </p>
      <a href="/" className="text-primary underline underline-offset-4">Go home</a>
    </div>
  )
}
