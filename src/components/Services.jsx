/**
 * Services Component
 * 
 * Displays the videography, editing, and aerial services offered
 */
export default function Services() {
  const services = [
    {
      title: "Cinematography",
      description: "Professional video production with cinema-grade cameras and lighting equipment for commercials, films, and corporate content."
    },
    {
      title: "Video Editing",
      description: "Expert post-production services including color grading, sound design, motion graphics, and visual effects."
    },
    {
      title: "Aerial Footage",
      description: "Licensed drone operators capturing stunning aerial shots and FPV sequences for any project."
    },
    {
      title: "Commercial Production",
      description: "End-to-end commercial video production from concept development to final delivery for brands and businesses."
    }
  ];

  return (
    <div className="services-container">
      <h2 className="services-title">OUR SERVICES</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-number">{`0${index + 1}`}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
