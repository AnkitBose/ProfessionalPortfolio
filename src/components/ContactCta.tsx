import { useState } from "react";

type Props = {
  email: string;
};

export default function ContactCta({ email }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="card mt-6 p-4">
      <p className="text-sm text-muted">Optional contact reveal is enabled by configuration.</p>
      {!revealed ? (
        <button
          type="button"
          className="focus-ring mt-3 rounded-md border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent"
          onClick={() => setRevealed(true)}
        >
          Reveal email contact
        </button>
      ) : (
        <a
          className="focus-ring mt-3 inline-block rounded-md border border-accent px-4 py-2 text-sm text-accent"
          href={`mailto:${email}`}
        >
          Email {email}
        </a>
      )}
    </div>
  );
}

