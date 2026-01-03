interface LinkProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Link({ onClick, children, className = '' }: LinkProps) {
  return (
    <button
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
