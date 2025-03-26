function Services() {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-purple-400 mb-8 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Threat Detection", desc: "Real-time analysis of potential cyber threats." },
              { title: "Vulnerability Assessment", desc: "Identify and address weaknesses in your systems." },
              { title: "Incident Response", desc: "Expert help when a security breach occurs." },
            ].map((service, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-600 hover:bg-gray-700 transition">
                <h3 className="text-white text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  export default Services;
  