function HeroSection() {
    return (
      <section className="text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-green-400">
              Empowering a Secure Digital World
            </h2>
            <p className="text-lg sm:text-xl mb-8 text-gray-300">
              Making people aware of cybersecurity threats and providing the tools
              to defend against them.
            </p>
            <a
              href="#learn-more"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 text-lg"
            >
              Get Started
            </a>
          </div>
          <div className="h-52 bg-gray-700 flex justify-center items-center text-gray-400 text-lg rounded">
            Live Threat Map (Simulated)
          </div>
        </div>
      </section>
    );
  }
  
  export default HeroSection;
  