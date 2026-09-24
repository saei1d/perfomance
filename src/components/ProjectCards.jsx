/**
 * ProjectCards Component
 * 
 * Displays 3 selected work projects with minimal, cinematic design
 * 
 * NOTE: These are placeholder projects. For the final version:
 * - Replace with real project data
 * - Add actual project thumbnails/videos
 * - Link to individual project pages
 * - Add hover effects and transitions
 */
export default function ProjectCards() {
  const projects = [
    {
      title: "Corporate Brand Video",
      category: "Commercial Production",
      description: "High-impact corporate video for a leading Toronto tech company"
    },
    {
      title: "Real Estate Aerial Tour",
      category: "Aerial Cinematography",
      description: "Stunning drone footage showcasing luxury properties across the GTA"
    },
    {
      title: "Music Video Production",
      category: "Creative Direction",
      description: "Artistic music video with dynamic editing and visual storytelling"
    }
  ];

  return (
    <div className="projects-container">
      <h2 className="projects-title">SELECTED WORK</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-placeholder">
              <div className="project-number">{`0${index + 1}`}</div>
            </div>
            <div className="project-info">
              <span className="project-category">{project.category}</span>
              <h3 className="project-name">{project.title}</h3>
              <p className="project-description">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
