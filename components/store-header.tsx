import { LogoutButton } from "./logout-button";
import { StoreLogo, StoreWordmark } from "./store-brand";

interface StoreHeaderProps {
  userName?: string;
}

export function StoreHeader({ userName }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-store-border/80 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <StoreLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
          <StoreWordmark
            subtitle={userName ? `歡迎，${userName}` : undefined}
          />
        </div>
        {userName && <LogoutButton />}
      </div>
    </header>
  );
}
