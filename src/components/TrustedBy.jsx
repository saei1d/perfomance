import './TrustedBy.css';

const CLIENTS = [
  { name: 'Netflix', logo: 'NETFLIX' },
  { name: 'Apple', logo: 'APPLE' },
  { name: 'Amazon', logo: 'AMAZON' },
  { name: 'Google', logo: 'GOOGLE' },
  { name: 'Microsoft', logo: 'MICROSOFT' },
  { name: 'Adobe', logo: 'ADOBE' },
  { name: 'Spotify', logo: 'SPOTIFY' },
  { name: 'Nike', logo: 'NIKE' },
  { name: 'Tesla', logo: 'TESLA' },
  { name: 'Samsung', logo: 'SAMSUNG' },
];

export default function TrustedBy() {
  // Create multiple copies for infinite loop
  const infiniteClients = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];

  return (
    <section className="trusted-by">
      <div className="trusted-by-header">
        <h2 className="trusted-by-title">Trusted by</h2>
      </div>
      <div className="trusted-by-film-strip">
        <div className="trusted-by-marquee">
          {infiniteClients.map((client, index) => (
            <div key={`${client.name}-${index}`} className="trusted-by-frame">
              <span className="trusted-by-logo">{client.logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}