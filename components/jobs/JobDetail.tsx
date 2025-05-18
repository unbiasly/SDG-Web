import { MoreVertical, MapPin, Users, Check } from "lucide-react";
import { JobListing } from "@/service/api.interface";
import ColoredDivider from "../feed/ColoredDivider";
import Image from "next/image";

interface JobDetailProps {
  job: JobListing;
}

const JobDetail = ({ job }: JobDetailProps) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Image src='/Logo.svg' alt='SDG Logo' width={40} height={40}  />
          <div>
            <h3 className="text-xl font-medium text-blue-600">{job.title}</h3>
            <p className="text-base">{job.company}</p>
          </div>
        </div>
        <button aria-label="more-options" className="text-gray-500">
          <MoreVertical size={24} />
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-gray-600" />
          <span className="text-sm text-gray-700">{job.applicants} applicants</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-gray-600" />
          <span className="text-sm text-gray-700">{job.location} • {job.postedDays} days ago</span>
        </div>
      </div>

      {job.matches && (
        <div className="flex flex-wrap gap-2 mb-5">
          {job.matches.map((match, index) => (
            <div key={index} className="bg-gray-200 rounded-full py-1 px-3 flex items-center gap-1 text-sm">
              <span className="text-gray-700">{match}</span>
              <Check size={14} className="text-white bg-blue-500 rounded-full p-0.5" />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-5">
        <button className="bg-[#154360] text-white py-2 rounded-md">Apply</button>
        <button className="border border-gray-300 py-2 rounded-md">Save</button>
      </div>

      <ColoredDivider />

      <div className="mt-5">
        <h2 className="font-semibold mb-4">About the job</h2>
        
        <section className="mb-6">
          <h3 className="font-medium mb-2">Overview</h3>
          <p className="text-sm leading-relaxed">
            We are looking to hire Flutter & ReactJs Developer plays a crucial role in designing 
            and implementing mobile and web applications using Flutter and ReactJs 
            technologies. They are responsible for developing engaging user interfaces and 
            ensuring seamless user experiences. This position is integral to the organization's 
            digital presence and enhancing customer interactions through innovative and 
            efficient applications.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Key Responsibilities</h3>
          <ul className="list-disc list-outside ml-5 text-sm space-y-1">
            <li>Develop and maintain high-quality mobile and web applications using Flutter and ReactJs.</li>
            <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
            <li>Optimize applications for maximum speed and scalability.</li>
            <li>Implement clean, modern, and smooth animations and transitions for an enhanced user experience.</li>
            <li>Ensure the technical feasibility of UI/UX designs.</li>
            <li>Integrate mobile and web applications with back-end services and databases.</li>
            <li>Monitor and improve front-end performance.</li>
            <li>Stay updated on emerging technologies in mobile and web development.</li>
            <li>Identify and correct bottlenecks and fix bugs.</li>
            <li>Conduct code reviews, testing, and debugging.</li>
            <li>Work on continuous improvement of development processes and tools.</li>
            <li>Provide technical guidance and support to other team members.</li>
            <li>Assure app quality, stability, and maintainability.</li>
            <li>Collaborate with designers to translate UI/UX design wireframes into code.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Required Qualifications</h3>
          <ul className="list-disc list-outside ml-5 text-sm space-y-1">
            <li>Bachelor's degree in Computer Science, Engineering, or related field.</li>
            <li>Proven experience as a Flutter developer, ReactJs developer & AWS</li>
            <li>Proficient in Dart programming language.</li>
            <li>Familiarity with Git for version control.</li>
            <li>Strong understanding of UI/UX design principles.</li>
            <li>Experience with Firebase for mobile/web development.</li>
            <li>Knowledge of RESTful APIs and JSON.</li>
            <li>Experience with automated testing suites and CI/CD pipelines.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="font-medium mb-2">Similar jobs</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b border-gray-200 pb-6">
                <div className="flex gap-4">
                  <Image src='/Logo.svg' alt='SDG Logo' width={40} height={40}  />
                  <div>
                    <h4 className="text-blue-600 font-medium">Flutter & ReactJs Developer</h4>
                    <p className="text-sm">UnbaislyAI</p>
                    <p className="text-sm text-gray-600">{job.location}</p>
                    <p className="text-sm text-gray-500 mt-1">Posted {job.postedDays} days ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-5 flex justify-center">
            <button className="text-green-600 flex items-center gap-2 text-sm border border-gray-200 rounded-full px-4 py-1.5">
              See more jobs like this
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDetail;
