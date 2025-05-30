const features = [
  // Add your features here
  { text: 'Feature 1', icon: null },
  { text: 'Feature 2', icon: null },
]

const Features = () => (
  <div className="features">
    {features.map(({ text, icon: Icon }) => (
      <div className="feature" key={text}>
        {Icon && <Icon height={24} width={24} />}
        <h4>{text}</h4>
      </div>
    ))}
  </div>
)

export default Features
