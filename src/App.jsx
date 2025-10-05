import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Clock, Utensils, Book, Coffee, Wifi, Users, Calendar, Navigation, Sparkles, Search, Building2, Download, Moon, Sun, Zap } from 'lucide-react';

const HoosierHelper = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey Hoosier! 👋 I'm your AI campus guide with info on 100+ IU buildings, dining, events, and everything campus life. What can I help you find?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lastBuilding, setLastBuilding] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple markdown parser for bold and italic
  const parseMarkdown = (text) => {
    const parts = [];
    let currentIndex = 0;
    
    // Split by markdown patterns
    const boldPattern = /\*\*(.*?)\*\*/g;
    const italicPattern = /\*(.*?)\*/g;
    
    // First pass: handle bold
    let match;
    let lastIndex = 0;
    
    while ((match = boldPattern.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        // Check for italics in this segment
        const italicMatches = [...beforeText.matchAll(italicPattern)];
        if (italicMatches.length > 0) {
          let italicLastIndex = 0;
          italicMatches.forEach((im, idx) => {
            if (im.index > italicLastIndex) {
              parts.push({ type: 'text', content: beforeText.substring(italicLastIndex, im.index) });
            }
            parts.push({ type: 'italic', content: im[1] });
            italicLastIndex = im.index + im[0].length;
          });
          if (italicLastIndex < beforeText.length) {
            parts.push({ type: 'text', content: beforeText.substring(italicLastIndex) });
          }
        } else {
          parts.push({ type: 'text', content: beforeText });
        }
      }
      
      // Add bold match
      parts.push({ type: 'bold', content: match[1] });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      const italicMatches = [...remainingText.matchAll(italicPattern)];
      if (italicMatches.length > 0) {
        let italicLastIndex = 0;
        italicMatches.forEach((im) => {
          if (im.index > italicLastIndex) {
            parts.push({ type: 'text', content: remainingText.substring(italicLastIndex, im.index) });
          }
          parts.push({ type: 'italic', content: im[1] });
          italicLastIndex = im.index + im[0].length;
        });
        if (italicLastIndex < remainingText.length) {
          parts.push({ type: 'text', content: remainingText.substring(italicLastIndex) });
        }
      } else {
        parts.push({ type: 'text', content: remainingText });
      }
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const renderMessage = (content) => {
    const lines = content.split('\n');
    
    return lines.map((line, lineIdx) => {
      const parsed = parseMarkdown(line);
      
      return (
        <div key={lineIdx} className="leading-relaxed">
          {parsed.map((part, partIdx) => {
            if (part.type === 'bold') {
              return <strong key={partIdx} className="font-bold">{part.content}</strong>;
            } else if (part.type === 'italic') {
              return <em key={partIdx} className="italic">{part.content}</em>;
            } else {
              return <span key={partIdx}>{part.content}</span>;
            }
          })}
        </div>
      );
    });
  };

  // Comprehensive IU Building Database (100+ buildings)
  const buildings = {
    // Academic Buildings
    'IF': { code: 'IF', name: 'Luddy Hall', nickname: 'Luddy', location: '700 N. Woodlawn Ave', departments: 'School of Informatics, Computing, and Engineering', hours: '24/7 with card access', tips: '3rd floor = quietest study. Basement Innovation Center for groups. Fastest WiFi on campus!' },
    'LI': { code: 'LI', name: 'Herman B Wells Library', nickname: 'Wells', location: '1320 E. 10th St', departments: 'Main Library', hours: 'Mon-Thu 8am-2am, Fri 8am-9pm, Sat 10am-9pm, Sun 10am-2am', tips: 'Graduate Tower (floors 9-11) = silent study. Bookmarket in basement open late. Can reserve study rooms online!' },
    'UB': { code: 'UB', name: 'Indiana Memorial Union', nickname: 'IMU', location: 'E. 7th St', departments: 'Student Union', hours: '7am-11pm daily', tips: 'Food court busiest 12-2pm. Try Tudor Room for quiet study. Bowling alley and hotel inside!' },
    'HH': { code: 'HH', name: 'Hodge Hall', nickname: 'Kelley', location: '1309 E. 10th St', departments: 'Kelley School of Business', hours: 'Mon-Fri 7am-11pm', tips: 'Undergraduate Commons has bookable group rooms. Best AC on campus in summer!' },
    'BH': { code: 'BH', name: 'Ballantine Hall', nickname: 'Ballantine', location: '1020 E. Kirkwood Ave', departments: 'Liberal Arts', hours: 'Standard academic hours', tips: 'Confusing layout! Room numbers tell you the floor. Computer labs on multiple floors.' },
    'GB': { code: 'GB', name: 'Goodbody Hall', nickname: 'Goodbody', location: 'E. 7th St and Woodlawn', departments: 'Economics and various', hours: 'Standard academic', tips: 'Quiet computer lab 3rd floor. Less crowded than other buildings.' },
    'WH': { code: 'WH', name: 'Woodburn Hall', nickname: 'Woodburn', location: '1100 E. 7th St', departments: 'Psychology and various', hours: 'Standard academic', tips: 'Computer lab in basement. Psychology department resources.' },
    'GA': { code: 'GA', name: 'Global and International Studies', nickname: 'GIS', location: '355 N. Eagleson Ave', departments: 'Global Studies', hours: 'Standard academic', tips: 'Modern building with nice study lounges. Great natural light!' },
    'PV': { code: 'PV', name: 'O Neill School', nickname: 'O Neill SPEA', location: '1315 E. 10th St', departments: 'Public and Environmental Affairs', hours: 'Standard academic', tips: 'Cafe has all-day breakfast sandwiches! Nice study spaces throughout.' },
    'SB': { code: 'SB', name: 'Student Building', nickname: 'Swain', location: '705 E. 7th St', departments: 'Advising, Registrar, Financial Aid', hours: 'Mon-Fri 8am-5pm', tips: 'Go EARLY in semester - lines are brutal! Use online services when possible.' },
    'ED': { code: 'ED', name: 'Wright Education Building', nickname: 'Wright Ed', location: '201 N. Rose Ave', departments: 'School of Education', hours: 'Standard academic', tips: 'Multiple quiet study areas. Education library inside.' },
    'CH': { code: 'CH', name: 'Chemistry Building', nickname: 'Chem', location: '800 E. Kirkwood Ave', departments: 'Chemistry', hours: 'Standard academic', tips: 'Connected to Simon Hall. Safety glasses required in lab areas!' },
    'SI': { code: 'SI', name: 'Simon Hall', nickname: 'Simon', location: '1000 E. Kirkwood Ave', departments: 'Science Building', hours: 'Standard academic', tips: 'Multidisciplinary science. Modern facilities. Safety training required for labs.' },
    'GY': { code: 'GY', name: 'Geological Sciences', nickname: 'Geology', location: '1001 E. 10th St', departments: 'Earth and Atmospheric Sciences', hours: 'Standard academic', tips: 'Cool rock/mineral displays in hallways!' },
    'JH': { code: 'JH', name: 'Biology Building', nickname: 'Biology', location: '1001 E. 3rd St', departments: 'Biology', hours: 'Standard academic', tips: 'Multiple computer labs. Greenhouse on roof!' },
    'LH': { code: 'LH', name: 'Lindley Hall', nickname: 'Lindley', location: '150 S. Woodlawn Ave', departments: 'Mathematics', hours: 'Standard academic', tips: 'Math Learning Center for tutoring. Quiet study on upper floors.' },
    'RH': { code: 'RH', name: 'Rawles Hall', nickname: 'Rawles', location: '100 S. Woodlawn Ave', departments: 'Mathematics and various', hours: 'Standard academic', tips: 'Another math building. Less crowded than Lindley.' },
    'FA': { code: 'FA', name: 'Fine Arts Building', nickname: 'Fine Arts', location: 'E. 7th St', departments: 'Art Studios', hours: 'Standard academic', tips: 'Student art shows regularly - free admission! Studios on multiple floors.' },
    'MC': { code: 'MC', name: 'Musical Arts Center', nickname: 'MAC', location: '101 N. Jordan Ave', departments: 'Music Performance', hours: 'Event-based', tips: 'Opera house! Student performances often free with ID. World-class acoustics.' },
    'FV': { code: 'FV', name: 'Sidney and Lois Eskenazi Museum of Art', nickname: 'Art Museum', location: '1133 E. 7th St', departments: 'Art Museum', hours: 'Tue-Sat 10am-5pm, Sun 12-5pm', tips: 'FREE admission! World-class collection. Closes at 5pm - plan accordingly!' },
    'LL': { code: 'LL', name: 'Lilly Library', nickname: 'Lilly', location: '1200 E. 7th St', departments: 'Rare Books and Manuscripts', hours: 'Mon-Fri 9am-6pm', tips: 'Houses Shakespeare First Folios and Gutenberg Bible! Free exhibits. No backpacks allowed.' },
    'CN': { code: 'CN', name: 'IU Cinema', nickname: 'Cinema', location: 'E. 7th St', departments: 'Film Screenings', hours: 'Event-based', tips: 'Free/cheap film screenings! Check schedule at cinema.indiana.edu' },
    'TH': { code: 'TH', name: 'Lee Norvelle Theatre', nickname: 'Theatre', location: '275 N. Jordan Ave', departments: 'Theatre and Drama', hours: 'Event-based', tips: 'Student theater productions. Professional-quality shows at student prices!' },
    'BC': { code: 'BC', name: 'Buskirk-Chumley Theatre', nickname: 'Buskirk', location: '114 E. Kirkwood Ave', departments: 'Performing Arts', hours: 'Event-based', tips: 'Downtown venue. Live music and performances. Walking distance from campus.' },
    'RB': { code: 'RB', name: 'Student Recreational Sports Center', nickname: 'SRSC', location: '1601 E. 7th St', departments: 'Recreation', hours: 'Daily 6am-11pm (varies)', tips: 'FREE with student ID! Least crowded 2-4pm. Pool requires swim test. Rock wall!' },
    'AS': { code: 'AS', name: 'Simon Skjodt Assembly Hall', nickname: 'Assembly Hall', location: '1001 E. 17th St', departments: 'Basketball Arena', hours: 'Event-based', tips: 'HOME of IU Basketball! Student tickets free/cheap. Get there early for big games!' },
    'MS': { code: 'MS', name: 'Memorial Stadium', nickname: 'The Rock', location: '1001 E. 17th St', departments: 'Football Stadium', hours: 'Event-based', tips: 'Football games! Student section is amazing. Tailgating culture.' },
    'AT': { code: 'AT', name: 'Armstrong Stadium', nickname: 'Armstrong', location: 'Bill Armstrong Stadium', departments: 'Soccer', hours: 'Event-based', tips: 'Soccer games! Free with student ID. Great atmosphere.' },
    'EG': { code: 'EG', name: 'Eigenmann Hall', nickname: 'Eigenmann', location: '1900 E. 10th St', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Graduate and upper-class housing. Cafe on ground floor.' },
    'WT': { code: 'WT', name: 'Wright Quad', nickname: 'Wright', location: 'Wright Quad', departments: 'Residence Halls', hours: '24/7 residents', tips: 'Food court in quad. Central location. Traditional dorms.' },
    'FR': { code: 'FR', name: 'Forest Quad', nickname: 'Forest', location: 'Forest Quad', departments: 'Residence Halls', hours: '24/7 residents', tips: 'Food court. AC in newer buildings. Southeast campus.' },
    'TE': { code: 'TE', name: 'Teter Quad', nickname: 'Teter', location: 'Teter Quad', departments: 'Residence Halls', hours: '24/7 residents', tips: 'Large quad. Food court. Mix of old and renovated buildings.' },
    'HC': { code: 'HC', name: 'IU Health Center', nickname: 'Health Center', location: '600 N. Jordan Ave', departments: 'Student Health Services', hours: 'Mon-Fri 8am-5pm', tips: 'Free/low-cost with insurance. Make appointments online. Pharmacy inside.' },
    'EP': { code: 'EP', name: 'Ernie Pyle Hall', nickname: 'Ernie Pyle', location: '940 E. 7th St', departments: 'Media School', hours: 'Standard academic', tips: 'Journalism and media. TV studio. Named after famous WWII correspondent.' },
    'LW': { code: 'LW', name: 'Maurer School of Law', nickname: 'Law School', location: '211 S. Indiana Ave', departments: 'Law School', hours: 'Extended hours', tips: 'Law library open to all students. Quiet study space.' },
    'IR': { code: 'IR', name: 'Innovation Center', nickname: 'Innovation Center', location: 'Luddy basement', departments: 'Maker Space & Collaboration', hours: 'Varies', tips: '3D printers, electronics lab, collaboration space. Part of Luddy!' },
    'LU': { code: 'LU', name: 'Luddy Center for Artificial Intelligence', nickname: 'AI Center', location: 'Near Luddy Hall', departments: 'AI Research', hours: 'Varies', tips: 'Cutting-edge AI research facility.' },
    'CR': { code: 'CR', name: 'Cyberinfrastructure Building', nickname: 'CIB', location: '2709 E. 10th St', departments: 'Research Computing', hours: 'Restricted', tips: 'Supercomputing center. Tours sometimes available!' },
    'PH': { code: 'PH', name: 'School of Public Health', nickname: 'Public Health', location: '1025 E. 7th St', departments: 'Public Health Programs', hours: 'Standard academic', tips: 'Modern facilities. Health science programs.' },
    'CY': { code: 'CY', name: 'MESH', nickname: 'MESH', location: 'Multidisciplinary Engineering & Sciences Hall', departments: 'Engineering & Sciences', hours: 'Standard academic', tips: 'New state-of-the-art engineering building!' },
    'S2': { code: 'S2', name: 'Multidisciplinary Science Building II', nickname: 'MSB II', location: 'Near Simon Hall', departments: 'Science Research', hours: 'Standard academic', tips: 'Research labs and classrooms.' },
    'KH': { code: 'KH', name: 'Kirkwood Hall', nickname: 'Kirkwood', location: 'E. Kirkwood Ave', departments: 'Various departments', hours: 'Standard academic', tips: 'Historic building in center of campus.' },
    'WY': { code: 'WY', name: 'Wylie Hall', nickname: 'Wylie', location: 'E. Kirkwood Ave', departments: 'History & various', hours: 'Standard academic', tips: 'Named after first IU president. Historic building.' },
    'SW': { code: 'SW', name: 'Swain West', nickname: 'Swain West', location: 'Swain Hall complex', departments: 'Classrooms', hours: 'Standard academic', tips: 'Part of Swain Hall complex.' },
    'SE': { code: 'SE', name: 'Swain East', nickname: 'Swain East', location: 'Swain Hall complex', departments: 'Classrooms', hours: 'Standard academic', tips: 'Part of Swain Hall complex with computer labs.' },
    'FF': { code: 'FF', name: 'Franklin Hall', nickname: 'Franklin', location: 'E. Kirkwood Ave', departments: 'Journalism & various', hours: 'Standard academic', tips: 'Journalism department. Historic building.' },
    'BY': { code: 'BY', name: 'Bryan Hall', nickname: 'Bryan', location: 'Near Sample Gates', departments: 'Various departments', hours: 'Standard academic', tips: 'Central campus location. Multiple departments.' },
    'MM': { code: 'MM', name: 'Memorial Hall', nickname: 'Memorial', location: 'E. 7th St', departments: 'Various offices', hours: 'Standard academic', tips: 'Historic memorial to IU veterans.' },
    'OP': { code: 'OP', name: 'Optometry Building', nickname: 'Optometry', location: 'E. Atwater Ave', departments: 'School of Optometry', hours: 'Standard academic', tips: 'Optometry school and clinic.' },
    'PY': { code: 'PY', name: 'Psychology Building', nickname: 'Psychology', location: 'E. 10th St', departments: 'Psychology Department', hours: 'Standard academic', tips: 'Psychology research labs and classrooms.' },
    'OW': { code: 'OW', name: 'Owen Hall', nickname: 'Owen', location: 'Owen Hall', departments: 'Various', hours: 'Standard academic', tips: 'Historic building near Sample Gates.' },
    'TV': { code: 'TV', name: 'Radio-Television Center', nickname: 'WFIU/WTIU', location: 'E. 7th St', departments: 'WFIU and WTIU', hours: 'Varies', tips: 'Public radio and TV stations. Studio tours available!' },
    'SM': { code: 'SM', name: 'Bess Meshulam Simon Music Library', nickname: 'Music Library', location: 'Near MAC', departments: 'Music Library & Recital Center', hours: 'Library hours', tips: 'Music library with recital spaces. Beautiful facility!' },
    'P': { code: 'P', name: 'Music Practice Building', nickname: 'Practice Rooms', location: 'Music campus', departments: 'Music Practice Rooms', hours: '24/7 for music students', tips: 'Practice rooms for music students. Soundproof!' },
    'MA': { code: 'MA', name: 'Music Addition', nickname: 'Music Addition', location: 'Music campus', departments: 'Music School', hours: 'Standard academic', tips: 'Additional music facilities and classrooms.' },
    'VD': { code: 'VD', name: 'Eskenazi School Mies Building', nickname: 'Mies', location: 'Near Fine Arts', departments: 'Art, Architecture + Design', hours: 'Standard academic', tips: 'Iconic Mies van der Rohe architecture!' },
    'CO': { code: 'CO', name: 'Eskenazi Wood and Metal Shop', nickname: 'Wood Shop', location: 'Near Fine Arts', departments: 'Art Studios', hours: 'Varies', tips: 'Woodworking and metalworking studios for art students.' },
    'JS': { code: 'JS', name: 'East Studio Building', nickname: 'East Studio', location: 'Music campus', departments: 'Music Studios', hours: 'Varies', tips: 'Music practice and studio spaces.' },
    'AM': { code: 'AM', name: 'DeVault Alumni Center', nickname: 'Alumni Center', location: 'N. Jordan Ave', departments: 'IU Alumni Association', hours: 'Mon-Fri business hours', tips: 'Alumni services and events.' },
    'CG': { code: 'CG', name: 'Godfrey Graduate Center', nickname: 'Godfrey', location: 'N. Fee Lane', departments: 'Graduate & Executive Education', hours: 'Standard academic', tips: 'Graduate and executive education programs.' },
    'EI': { code: 'EI', name: 'Ferguson International Center', nickname: 'International Center', location: 'N. Jordan Ave', departments: 'International Services', hours: 'Mon-Fri business hours', tips: 'Support for international students and scholars!' },
    'HU': { code: 'HU', name: 'Hutton Honors College', nickname: 'Hutton', location: 'N. Jordan Ave', departments: 'Honors College', hours: 'Standard academic', tips: 'Honors advising and programs. Study spaces for honors students.' },
    'C2': { code: 'C2', name: 'Classroom-Office Building', nickname: 'COB', location: 'Near campus', departments: 'Classrooms & Offices', hours: 'Standard academic', tips: 'General purpose classrooms.' },
    'BD': { code: 'BD', name: 'Cook Hall', nickname: 'Cook', location: 'Cook Hall', departments: 'Various', hours: 'Standard academic', tips: 'Academic building with computer labs.' },
    'ME': { code: 'ME', name: 'Cravens Hall', nickname: 'Cravens', location: 'Collins LLC', departments: 'Collins Living-Learning Center', hours: '24/7 residents', tips: 'Part of Collins residential community.' },
    'EO': { code: 'EO', name: 'Edmondson Hall', nickname: 'Edmondson', location: 'Collins LLC', departments: 'Collins Living-Learning Center', hours: '24/7 residents', tips: 'Part of Collins residential community.' },
    'MQ': { code: 'MQ', name: 'Mason Hall', nickname: 'Mason', location: 'Foster Quad', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Part of Foster Quad residential community.' },
    'FQ': { code: 'FQ', name: 'Martin Hall', nickname: 'Martin', location: 'Foster Quad', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Part of Foster Quad residential community.' },
    'IS': { code: 'IS', name: 'Jenkinson Hall', nickname: 'Jenkinson', location: 'Foster Quad', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Part of Foster Quad residential community.' },
    'SH': { code: 'SH', name: 'Shea Hall', nickname: 'Shea', location: 'Foster Quad', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Part of Foster Quad residential community.' },
    'GR': { code: 'GR', name: 'Gresham Dining Hall', nickname: 'Gresham', location: 'Foster Quad', departments: 'Dining Hall', hours: 'Meal hours', tips: 'Foster Quad dining - same as Foster Food Court!' },
    'MN': { code: 'MN', name: 'McNutt Central', nickname: 'McNutt', location: 'McNutt Quad', departments: 'Residence Halls', hours: '24/7 residents', tips: 'Large residential quad. Party reputation but great community!' },
    'BQ': { code: 'BQ', name: 'Briscoe Quad', nickname: 'Briscoe', location: 'Briscoe Quadrangle', departments: 'Residence Halls', hours: '24/7 residents', tips: 'Traditional residence halls. Central location.' },
    'HL': { code: 'HL', name: 'Alice McDonald Nelson Halls', nickname: 'Nelson', location: 'Nelson Halls', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Residential community on campus.' },
    'WI': { code: 'WI', name: 'Willkie Quad', nickname: 'Willkie', location: 'Willkie Quadrangle', departments: 'Residence Halls', hours: '24/7 residents', tips: 'Multiple buildings in quad. Air-conditioned!' },
    'RE': { code: 'RE', name: 'Read Hall', nickname: 'Read', location: 'Read Hall', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Residential community.' },
    'SY': { code: 'SY', name: 'Sycamore Hall', nickname: 'Sycamore', location: 'Sycamore Hall', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Residential community with AC.' },
    'MX': { code: 'MX', name: 'Maxwell Hall', nickname: 'Maxwell', location: 'Near campus', departments: 'Various', hours: 'Standard academic', tips: 'Academic and office space.' },
    'MY': { code: 'MY', name: 'Myers Hall', nickname: 'Myers', location: 'Myers Hall', departments: 'Various', hours: 'Standard academic', tips: 'Academic building with classrooms.' },
    'MU': { code: 'MU', name: 'Merrill Hall', nickname: 'Merrill', location: 'Music campus', departments: 'Jacobs School of Music', hours: 'Standard academic', tips: 'Music school facilities. Practice and performance spaces.' },
    'MO': { code: 'MO', name: 'Morrison Hall', nickname: 'Morrison', location: 'Morrison Hall', departments: 'Various', hours: 'Standard academic', tips: 'Academic building.' },
    'I': { code: 'I', name: 'Myles Brand Hall', nickname: 'Brand Hall', location: 'E. 10th St', departments: 'Various offices', hours: 'Business hours', tips: 'Named after former IU president.' },
    'VW': { code: 'VW', name: 'Wilkinson Hall', nickname: 'Wilkinson', location: 'Near SRSC', departments: 'Volleyball/Wrestling Arena', hours: 'Event-based', tips: 'Indoor volleyball and wrestling venue!' },
    'GF': { code: 'GF', name: 'Bill Garrett Fieldhouse', nickname: 'Fieldhouse', location: 'Athletic complex', departments: 'Indoor Sports Facility', hours: 'Varies', tips: 'Indoor track and field. Practice facility.' },
    'NF': { code: 'NF', name: 'Gladstein Fieldhouse', nickname: 'Gladstein', location: 'Athletic complex', departments: 'Indoor Track Facility', hours: 'Varies', tips: 'Indoor track and field venue.' },
    'TP': { code: 'TP', name: 'Tennis Center', nickname: 'Tennis', location: 'Athletic complex', departments: 'Tennis Courts', hours: 'Varies', tips: 'Indoor and outdoor tennis facilities.' },
    'MV': { code: 'MV', name: 'Mellencamp Pavilion', nickname: 'Mellencamp', location: 'Athletic complex', departments: 'Practice Facility', hours: 'Restricted', tips: 'Football practice facility.' },
    'GI': { code: 'GI', name: 'Intercollegiate Athletics Gym', nickname: 'ICA Gym', location: 'Athletic complex', departments: 'Athletics Offices', hours: 'Business hours', tips: 'Athletic department offices and facilities.' },
    'MG': { code: 'MG', name: 'Ray E. Cramer Marching Hundred Hall', nickname: 'Marching Band', location: 'Near stadium', departments: 'Marching Band', hours: 'Varies', tips: 'Home of IU Marching Hundred!' },
    'GT': { code: 'GT', name: 'IU Golf Teaching Center', nickname: 'Golf Center', location: 'Golf course', departments: 'Golf Training', hours: 'Varies', tips: 'Golf practice and training facility.' },
    'OD': { code: 'OD', name: 'Outdoor Pool', nickname: 'Pool', location: 'Near SRSC', departments: 'Recreation', hours: 'Summer season', tips: 'Outdoor pool open in warm weather!' },
    'OB': { code: 'OB', name: 'Kirkwood Observatory', nickname: 'Observatory', location: 'Kirkwood Ave', departments: 'Astronomy', hours: 'Public viewing nights', tips: 'Historic observatory. Free public viewings!' },
    'M2': { code: 'M2', name: 'IU Museum of Archaeology', nickname: 'Archaeology Museum', location: 'Student Building', departments: 'Museum', hours: 'Limited hours', tips: 'Free museum! Check hours online.' },
    'LS': { code: 'LS', name: 'Lewis Building', nickname: 'Lewis', location: '4th & Indiana', departments: 'Various offices', hours: 'Business hours', tips: 'Administrative offices.' },
    'S7': { code: 'S7', name: 'Institute for Social Research', nickname: 'ISR', location: 'Research facility', departments: 'Social Research', hours: 'Business hours', tips: 'Research center and survey facility.' },
    'R2': { code: 'R2', name: 'Journal of American History', nickname: 'JAH', location: 'Near campus', departments: 'Academic Journal', hours: 'Business hours', tips: 'Scholarly journal offices.' },
    'TT': { code: 'TT', name: 'Tulip Tree Apartments', nickname: 'Tulip Tree', location: 'Campus apartments', departments: 'Graduate/Family Housing', hours: '24/7 residents', tips: 'Graduate student and family housing.' },
    'WN': { code: 'WN', name: 'Persimmon A & B', nickname: 'Persimmon', location: 'Walnut Grove Center', departments: 'Residence Halls', hours: '24/7 residents', tips: 'Part of residential community.' },
    'WS': { code: 'WS', name: 'Chestnut C & D', nickname: 'Chestnut', location: 'Walnut Grove Center', departments: 'Residence Halls', hours: '24/7 residents', tips: 'Part of residential community.' },
    'MZ': { code: 'MZ', name: 'Disability and Community', nickname: 'Disability Center', location: 'Near campus', departments: 'Disability Services', hours: 'Business hours', tips: 'Support services for students with disabilities.' },
    'RA': { code: 'RA', name: 'Spruce Hall', nickname: 'Spruce', location: 'Residential area', departments: 'Residence Hall', hours: '24/7 residents', tips: 'Residential community on campus.' },
  };

  // Dining Database - COMPLETE & ACCURATE
  const dining = {
    // All-You-Care-To-Eat Dining Halls
    'wright': { name: 'Wright Dining Hall', type: 'All-You-Care-To-Eat', location: 'Wright Quad', nearBuildings: ['Wright Quad', 'Central Campus'], hours: 'Check dining.indiana.edu', stations: 'Multiple stations with variety', peak: '12-1pm and 5-7pm', cost: 'Meal swipe or Dining Dollars', tips: 'Central location! Busiest dining hall. Go at 11am or 2pm to avoid crowds.' },
    'forest': { name: 'Forest Dining Hall', type: 'All-You-Care-To-Eat', location: 'Forest Quad', nearBuildings: ['Forest Quad', 'Southeast Campus'], hours: 'Check dining.indiana.edu', stations: 'Multiple stations with variety', peak: '11:30am-1:30pm', cost: 'Meal swipe or Dining Dollars', tips: 'Southeast campus. Less crowded than Wright. Great for dinner!' },
    'collins': { name: 'Collins Eatery', type: 'All-You-Care-To-Eat', location: 'Collins Living-Learning Center', nearBuildings: ['Collins LLC', 'Cravens Hall', 'Edmondson Hall'], hours: 'Check dining.indiana.edu', stations: 'Rotating menu', peak: 'Less crowded', cost: 'Meal swipe or Dining Dollars', tips: 'Hidden gem! Smaller, quieter, less busy. Perfect if you want to avoid crowds.' },
    'mcnutt': { name: 'McNutt Dining Hall', type: 'All-You-Care-To-Eat', location: 'McNutt Quad', nearBuildings: ['McNutt Central', 'McNutt North', 'McNutt South'], hours: 'Check dining.indiana.edu', stations: 'Multiple stations', peak: 'Dinner rush 5-7pm', cost: 'Meal swipe or Dining Dollars', tips: 'Northwest campus. Convenient for McNutt residents and nearby buildings.' },
    'goodbody': { name: 'Goodbody Hall Eatery', type: 'All-You-Care-To-Eat', location: 'Goodbody Hall', nearBuildings: ['Goodbody Hall', 'Central Campus', 'Ballantine'], hours: 'Check dining.indiana.edu', stations: 'Dining hall style', peak: 'Lunch rush', cost: 'Meal swipe or Dining Dollars', tips: 'In an academic building! Super convenient for classes.' },
    
    // IMU Food Court
    'imu': { name: 'IMU Food Court', type: 'Restaurant Hub', location: 'Indiana Memorial Union', nearBuildings: ['IMU', 'Luddy Hall', 'Kelley', 'Wells Library'], hours: 'Varies by vendor', stations: '11 options: The Globe, Chick-fil-A, Panda Express, Pizza, Asian fusion, burgers, and more', peak: '12-2pm insane rush', cost: 'Combo meal, Dining Dollars, or card', tips: 'MOST variety on campus! Super crowded at lunch. Try 11am or 2:30pm. Also has Tudor Room for sit-down dining.' },
    
    // Bookmarket
    'bookmarket': { name: 'Bookmarket', type: 'Restaurant Hub', location: 'Wells Library (lowest level)', nearBuildings: ['Wells Library', 'Luddy Hall', 'Kelley'], hours: 'Extended late hours', stations: "King's Hawaiian (chicken sandwiches), BlenzBowls (acai & smoothies), soup, salad, more", peak: 'Study session rush', cost: 'Combo meal, Dining Dollars, or card', tips: 'LATE NIGHT HERO! Open when everything else closes. Perfect study break food!' },
    
    // Campus Cafes
    'ballantine_cafe': { name: 'Ballantine Cafe', type: 'Coffee & Pastries', location: 'Ballantine Hall', nearBuildings: ['Ballantine Hall', 'Central Campus'], hours: 'Weekday hours', stations: 'Coffee and pastries', peak: 'Morning rush', cost: 'Card or CrimsonCash', tips: 'Perfect for a quick coffee between classes in Ballantine!' },
    'education_cafe': { name: 'Education Cafe', type: 'Coffee & Pastries', location: 'Wright Education Building', nearBuildings: ['Wright Education Building'], hours: 'Weekday hours', stations: 'Coffee and pastries', peak: 'Mornings', cost: 'Card or CrimsonCash', tips: 'Grab coffee before or after education classes!' },
    'eigenmann_cafe': { name: 'Eigenmann Cafe', type: 'The Globe Cuisine', location: 'Eigenmann Hall', nearBuildings: ['Eigenmann Hall', 'East Campus'], hours: 'Lunch and dinner', stations: 'Daily rotation from local restaurants: Indian, Mexican, Filipino, Chinese, Hawaiian, plus vegan', peak: 'Lunch rush', cost: 'Combo meal or card', tips: 'Rotating local food! Check what cuisine is featured today. Great variety!' },
    'eskenazi_cafe': { name: 'Eskenazi Museum Cafe', type: 'Coffee & Pastries', location: 'Eskenazi Museum of Art', nearBuildings: ['Eskenazi Museum', 'Fine Arts'], hours: 'Museum hours', stations: 'Coffee and pastries', peak: 'Afternoon', cost: 'Card or CrimsonCash', tips: 'Enjoy coffee while visiting the museum!' },
    'godfrey_cafe': { name: 'Godfrey Cafe', type: 'Mediterranean/Kosher', location: 'Godfrey Graduate Center', nearBuildings: ['Godfrey Center'], hours: 'Weekday hours', stations: 'Yalla - kosher Mediterranean customizable bowls', peak: 'Lunch', cost: 'Combo meal or card', tips: 'Kosher option! Mediterranean bowls are delicious and healthy.' },
    'hodge_cafe': { name: 'Hodge Cafe', type: 'Poke Bowls', location: 'Hodge Hall (Kelley)', nearBuildings: ['Kelley School', 'Hodge Hall'], hours: 'Weekday hours', stations: 'Poke by Sushi King - customizable poke bowls', peak: 'Lunch rush', cost: 'Combo meal or card', tips: 'Fresh poke in Kelley! Perfect for a healthy lunch.' },
    'oneill_cafe': { name: "O'Neill Cafe", type: 'Cafe', location: "O'Neill School", nearBuildings: ["O'Neill School", 'SPEA'], hours: 'Weekday hours', stations: 'Breakfast sandwiches, coffee, light meals', peak: 'Mornings', cost: 'Combo meal or card', tips: 'ALL-DAY breakfast sandwiches! Hidden gem for breakfast anytime.' },
    'read_poke': { name: 'Poke by Sushi King (Read Hall)', type: 'Poke Bowls', location: 'Read Hall', nearBuildings: ['Read Hall'], hours: 'Check hours', stations: 'Customizable poke bowls and sushi', peak: 'Lunch', cost: 'Combo meal or card', tips: 'Fresh poke and sushi! Great healthy option.' },
    
    // Starbucks Locations
    'imu_starbucks': { name: 'IMU Starbucks', type: 'Starbucks', location: 'IMU first floor', nearBuildings: ['IMU', 'Luddy', 'Kelley', 'Central Campus'], hours: 'Early morning-evening', stations: 'Full Starbucks menu', peak: '8-10am and 1-3pm', cost: 'Card, CrimsonCash, or cash', tips: 'ALWAYS a line during peak! Mobile order ahead or go off-peak. Cash accepted here!' },
    'mcnutt_starbucks': { name: 'McNutt Starbucks', type: 'Starbucks', location: 'McNutt Center Building', nearBuildings: ['McNutt Quad'], hours: 'Check hours', stations: 'Full Starbucks menu', peak: 'Mornings', cost: 'Card or CrimsonCash', tips: 'Convenient for McNutt residents! Use mobile order.' },
    'read_starbucks': { name: 'Read Hall Starbucks', type: 'Starbucks', location: 'Read Hall main floor', nearBuildings: ['Read Hall'], hours: 'Check hours', stations: 'Full Starbucks menu', peak: 'Mornings', cost: 'Card or CrimsonCash', tips: 'Quieter Starbucks option! Less crowded than IMU.' },
    
    // Campus Stores
    'briscoe_store': { name: 'Briscoe Campus Store', type: 'Convenience Store', location: 'Briscoe Quad', nearBuildings: ['Briscoe Quad'], hours: 'Check hours', stations: 'Grab-and-go, snacks, essentials', peak: 'Evenings', cost: 'CrimsonCash, Dining Dollars, or card', tips: 'Late night snacks for Briscoe residents!' },
    'mcnutt_store': { name: 'McNutt Campus Store', type: 'Convenience Store', location: 'McNutt Quad', nearBuildings: ['McNutt Quad'], hours: 'Check hours', stations: 'Grab-and-go, snacks, essentials', peak: 'Evenings', cost: 'CrimsonCash, Dining Dollars, or card', tips: 'Convenient for late night munchies!' },
    'union_street': { name: 'Union Street Center', type: 'Convenience Store', location: 'Union Street', nearBuildings: ['Campus area'], hours: 'Check hours', stations: 'Grab-and-go, hot food, convenience items', peak: 'Varies', cost: 'CrimsonCash, Dining Dollars, or card', tips: 'Hot food options plus convenience store!' },
  };

  // Smart dining recommendation system
  const getNearbyDining = (buildingName) => {
    const nearby = [];
    
    for (const [key, loc] of Object.entries(dining)) {
      if (loc.nearBuildings && loc.nearBuildings.some(b => 
        buildingName.toLowerCase().includes(b.toLowerCase()) || 
        b.toLowerCase().includes(buildingName.toLowerCase())
      )) {
        nearby.push(loc);
      }
    }
    
    // Default recommendations by area if no specific matches
    if (nearby.length === 0) {
      if (buildingName.toLowerCase().includes('forest')) {
        nearby.push(dining.forest);
      } else if (buildingName.toLowerCase().includes('wright')) {
        nearby.push(dining.wright);
      } else if (buildingName.toLowerCase().includes('mcnutt')) {
        nearby.push(dining.mcnutt, dining.mcnutt_starbucks);
      } else if (buildingName.toLowerCase().includes('collins') || buildingName.toLowerCase().includes('cravens') || buildingName.toLowerCase().includes('edmondson')) {
        nearby.push(dining.collins);
      } else if (buildingName.toLowerCase().includes('luddy') || buildingName.toLowerCase().includes('kelley') || buildingName.toLowerCase().includes('wells') || buildingName.toLowerCase().includes('imu')) {
        nearby.push(dining.imu, dining.bookmarket, dining.imu_starbucks);
      } else if (buildingName.toLowerCase().includes('ballantine')) {
        nearby.push(dining.ballantine_cafe, dining.imu);
      } else if (buildingName.toLowerCase().includes('goodbody')) {
        nearby.push(dining.goodbody, dining.imu);
      } else {
        // Default central campus options
        nearby.push(dining.imu, dining.wright);
      }
    }
    
    return nearby;
  };

  const formatNearbyDining = (buildingName) => {
    const nearby = getNearbyDining(buildingName);
    
    if (nearby.length === 0) {
      return '🍽️ Check IMU Food Court or Wright Dining Hall (central campus options)';
    }
    
    let result = '🍽️ **Nearby Dining Options:**\n\n';
    nearby.forEach((loc, idx) => {
      if (idx < 3) {
        result += `**${loc.name}** (${loc.type})\n`;
        result += `→ ${loc.location}\n`;
        result += `💡 ${loc.tips}\n\n`;
      }
    });
    
    return result.trim();
  };

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    const currentHour = new Date().getHours();
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    
    // PRIORITY: Check for distance queries with context FIRST
    if ((msg.includes('how far') || msg.includes('distance') || (msg.includes('from') && lastBuilding)) && lastBuilding) {
      // Try to find the destination building
      let destination = null;
      for (const [code, bldg] of Object.entries(buildings)) {
        const nameWords = bldg.name.toLowerCase().split(' ');
        const nicknameWords = bldg.nickname.toLowerCase().split(' ');
        
        if (msg.includes(bldg.name.toLowerCase()) || 
            msg.includes(bldg.nickname.toLowerCase()) ||
            nameWords.some(word => word.length > 3 && msg.includes(word)) ||
            nicknameWords.some(word => word.length > 3 && msg.includes(word))) {
          destination = bldg;
          break;
        }
      }
      
      if (destination) {
        const from = lastBuilding.toLowerCase();
        const to = destination.nickname.toLowerCase();
        
        // Predefined common routes with times
        if ((from.includes('luddy') && to.includes('forest')) || (from.includes('forest') && to.includes('luddy'))) {
          return `🚶 **Walking Distance:**\n\n**${lastBuilding} → ${destination.name}**\n⏱️ **10-12 minutes walk** (~0.5 miles)\n\n**Route:**\n• Head southeast through campus\n• Pleasant walk through central areas\n\n**Options:**\n🚌 Campus bus Route E serves this area\n🚶 Walking is nice when weather is good\n\n🗺️ Exact route: https://www.google.com/maps/dir/${encodeURIComponent(lastBuilding + ' IU Bloomington')}/${encodeURIComponent(destination.name + ' IU Bloomington')}`;
        }
        
        if ((from.includes('luddy') && to.includes('imu')) || (from.includes('imu') && to.includes('luddy'))) {
          return `🚶 **Walking Distance:**\n\n**${lastBuilding} → ${destination.name}**\n⏱️ **5-7 minutes walk** (~0.3 miles)\n\n**Route:**\n• Very close! Down 7th Street\n• Super easy between classes\n\n💡 **Perfect for:** Grabbing food at IMU between Luddy classes!\n\n🗺️ Exact route: https://www.google.com/maps/dir/${encodeURIComponent(lastBuilding + ' IU Bloomington')}/${encodeURIComponent(destination.name + ' IU Bloomington')}`;
        }
        
        if ((from.includes('luddy') && to.includes('wells')) || (from.includes('wells') && to.includes('luddy'))) {
          return `🚶 **Walking Distance:**\n\n**${lastBuilding} → ${destination.name}**\n⏱️ **3-5 minutes walk** (~0.2 miles)\n\n**Route:**\n• Super close neighbors!\n• Just across the street area\n\n💡 **Perfect for:** Quick study break or library visit!\n\n🗺️ Exact route: https://www.google.com/maps/dir/${encodeURIComponent(lastBuilding + ' IU Bloomington')}/${encodeURIComponent(destination.name + ' IU Bloomington')}`;
        }
        
        if ((from.includes('luddy') && to.includes('kelley')) || (from.includes('kelley') && to.includes('luddy'))) {
          return `🚶 **Walking Distance:**\n\n**${lastBuilding} → ${destination.name}**\n⏱️ **7-10 minutes walk** (~0.4 miles)\n\n**Route:**\n• Head down 10th Street\n• Easy walk through central campus\n\n💡 Plenty of time between classes!\n\n🗺️ Exact route: https://www.google.com/maps/dir/${encodeURIComponent(lastBuilding + ' IU Bloomington')}/${encodeURIComponent(destination.name + ' IU Bloomington')}`;
        }
        
        // Default for any building pair
        return `🚶 **Walking Distance:**\n\n**${lastBuilding} → ${destination.name}**\n\n**Estimated Time:**\n• Central campus: 5-10 minutes\n• Cross-campus: 15-20 minutes\n• To athletics: 15-20 minutes\n\n**Get directions:**\n🗺️ Google Maps: https://www.google.com/maps/dir/${encodeURIComponent(lastBuilding + ' IU Bloomington')}/${encodeURIComponent(destination.name + ' IU Bloomington')}\n🗺️ IU Map: map.iu.edu\n\n💡 **Tip:** 10 min between classes is usually enough!`;
      }
    }
    
    // Help and Welcome
    if (msg.includes('help') || msg === 'hi' || msg === 'hello' || msg === 'hey' || msg.includes('what can you')) {
      return `**🎓 Hoosier Helper - Your AI Campus Guide**\n\nI know everything about IU Bloomington! Ask me about:\n\n**🏛️ Buildings (100+)**\n"Where is Luddy?" • "What's in Ballantine?" • "Nearest bathroom to IMU?"\n\n**🍕 Dining and Food**\n"What's open now?" • "Best food court?" • "Late night food?"\n\n**📚 Study Spots**\n"Quiet study space" • "Group room available?" • "24/7 access?"\n\n**☕ Coffee Shops**\n"Coffee near me?" • "Best cafe?" • "Starbucks locations?"\n\n**🚌 Getting Around**\n"Campus bus info" • "Walking time calculator" • "Bike parking?"\n\n**📅 Campus Life**\n"Events tonight?" • "Basketball schedule?" • "Free activities?"\n\n**💡 Pro Tips**\n"Best WiFi spots" • "Avoid crowds" • "Hidden gems"\n\n**Try:** "I'm at Luddy, where's the nearest food?" or "Best place to study for finals?"`;
    }
    
    // Time-aware responses
    if (msg.includes('open now') || msg.includes('what is open') || msg.includes('whats open')) {
      let response = `🕐 **What's Open Right Now** (${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})})\n\n`;
      
      if (currentHour >= 7 && currentHour < 21) {
        response += `**✅ OPEN:**\n• Wright Food Court (AYCTE)\n• Forest Food Court (AYCTE)\n• IMU Food Court (variety)\n• Wells Library\n• Most academic buildings\n• SRSC (Rec Center)\n\n`;
      } else if (currentHour >= 21 || currentHour < 2) {
        response += `**🌙 LATE NIGHT OPTIONS:**\n• Wells Library (until 2am Sun-Thu)\n• Bookmarket (Wells basement - snacks!)\n• Luddy Hall (24/7 with card)\n\n**Closed:**\n• Most dining halls\n• IMU Food Court\n`;
      } else {
        response += `**😴 Very Late/Early Morning:**\n• Almost everything is closed\n• Luddy Hall (24/7 with card access)\n• Some residence hall lounges\n\n💡 Dining opens around 7am!`;
      }
      
      response += `\n_Check exact hours at dining.indiana.edu and libraries.indiana.edu_`;
      return response;
    }
    
    // Study spots - enhanced with time awareness
    if (msg.includes('study') || msg.includes('quiet') || msg.includes('library') || msg.includes('focus')) {
      return `📚 **Best Study Spots at IU**\n\n**🤫 SUPER QUIET (Silent Study):**\n• Wells Library Graduate Tower (floors 9-11) - Elite quiet zone\n• Wells Main Library 4th Floor East - Designated quiet\n• Luddy Hall 3rd floor after 7pm - CS haven\n\n**👥 GROUP STUDY (Talking Allowed):**\n• Kelley Undergraduate Commons - BOOKABLE ROOMS!\n  → Reserve at kelley.iu.edu\n• Luddy Innovation Center (basement) - Whiteboards, tech\n• Wells study rooms - First-come first-served\n• IMU study rooms - Can reserve online\n\n**🌙 LATE NIGHT (Open Late):**\n• Wells Library (until 2am Sun-Thu!)\n• Luddy Hall (24/7 with ID card)\n• Some residence halls (if you live there)\n\n**⚡ BEST WIFI + OUTLETS:**\n• Luddy (fastest internet on campus)\n• Kelley Commons (great speed)\n• Wells Library (reliable)\n• Most academic buildings\n\n**☕ COFFEE + STUDY:**\n• Near cafe for caffeine runs\n• Bookmarket (Wells) - Snacks nearby!\n\n**🎯 PRO STRATEGIES:**\n• Finals week? Arrive EARLY at Wells\n• Need printer? Most libraries have them\n• Room reservation? Book 24-48 hours ahead\n• Avoid 12-3pm - busiest time everywhere\n\n💡 **Secret tip:** Lilly Library reading room is gorgeous and quiet, but no laptops allowed!`;
    }
    
    // Coffee - comprehensive
    if (msg.includes('coffee') || msg.includes('cafe') || msg.includes('caffeine') || msg.includes('starbucks')) {
      return `☕ **Complete IU Coffee Guide**\n\n**ON CAMPUS:**\n\n☕ **Starbucks (3 Locations)**\n→ IMU Starbucks (Main floor) - Busiest, mobile order!\n→ McNutt Starbucks - Convenient for residents\n→ Read Hall Starbucks - Quietest option\n→ Tip: PACKED 8-10am & 1-3pm, mobile order ahead!\n\n☕ **Campus Cafes**\n→ Eigenmann Cafe - Rotating local cuisine\n→ O'Neill Cafe - All-day breakfast!\n→ Ballantine Cafe - Quick coffee between classes\n→ Education Cafe - Near Wright Ed\n→ Eskenazi Museum Cafe - Coffee + art\n→ Godfrey Cafe - Mediterranean vibes\n→ Hodge Cafe - In Kelley building\n\n**OFF CAMPUS (Walking Distance):**\n\n⭐ **Soma Coffee House** - Kirkwood Ave\n→ Artisan coffee, amazing vibe\n→ Student favorite, great study spot\n→ Local and independent\n\n⭐ **Hopscotch Coffee** - Downtown\n→ Hip atmosphere, good for working\n→ Excellent espresso drinks\n\n⭐ **Pourhouse Cafe** - Multiple locations\n→ Local chain, reliable quality\n→ Good for meetings/study groups\n\n⭐ **Crumble Coffee** - Near campus\n→ Pastries + coffee combo\n→ Cozy atmosphere\n\n**LATE NIGHT CAFFEINE:**\n• Bookmarket (Wells Library) - Open latest\n• Some residence hall c-stores\n• Gas stations on 3rd St\n\n**☕ CROWD AVOIDANCE STRATEGY:**\n• IMU Starbucks: Skip 8-10am & 12-3pm\n• Best times: Before 8am, after 3pm\n• Weekends are much quieter\n\n💡 **Pro tip:** Keep reusable cup - many places give discounts!`;
    }
    
    // Transportation - should be checked BEFORE building search
    if (msg.includes('bus') || msg.includes('transport') || msg.includes('shuttle') || msg.includes('get to')) {
      return `🚌 **IU Campus Transportation**\n\n**CAMPUS BUS SERVICE:**\n\n**Main Routes:**\n• Route B - Main campus loop\n• Route E - East campus\n• Route F - Far east areas\n• Route W - West/northwest\n• Route X - Express service\n• **Route CM** - Campus/Mall Shuttle\n  → Begins at stadium, serves central campus\n  → All neighborhoods to College Mall & Jackson Creek Shopping Center\n\n**Schedule:**\n• Mon-Fri: 7am-6pm (frequent service)\n• Evenings: Limited routes\n• Weekends: Reduced schedule\n• Breaks: Minimal service\n\n**💡 MUST-HAVE APPS:**\n📱 IU Mobile app → Search "Bus Status"\n📱 ETA Spot app → Real-time tracking\n🌐 bloomingtontransit.etaspot.net\n\n**PRO TIPS:**\n• Buses are FREE with IU ID!\n• Track in real-time (don't just wait!)\n• Peak times (10am-3pm) = PACKED\n• Leave 10-15 min buffer for connections\n• Bad weather = extra crowded\n• CM Route great for shopping trips!\n\n**ALTERNATIVE TRANSPORT:**\n🚶 Walking - Most of campus is 15-20 min\n🚲 Bikes - Racks everywhere, Pace bikes available\n🛴 Scooters - VeoRide and Spin around town\n\n💡 **Secret:** Walking is often faster than waiting for the bus!`;
    }
    
    // Building search - enhanced with better matching
    
    // First pass: exact or close name matches
    for (const [code, bldg] of Object.entries(buildings)) {
      const nameWords = bldg.name.toLowerCase().split(' ');
      const nicknameWords = bldg.nickname.toLowerCase().split(' ');
      
      // Only match if we have a significant word match (length > 4)
      const hasNameMatch = nameWords.some(word => word.length > 4 && msg.includes(word));
      const hasNicknameMatch = nicknameWords.some(word => word.length > 4 && msg.includes(word));
      const hasExactMatch = msg.includes(bldg.name.toLowerCase()) || msg.includes(bldg.nickname.toLowerCase());
      
      if (hasExactMatch || hasNameMatch || hasNicknameMatch) {
        
        // Remember this building for future context
        setLastBuilding(bldg.name);
        
        // Check if they're asking about nearby food
        if (msg.includes('food') || msg.includes('eat') || msg.includes('dining') || msg.includes('nearby')) {
          return formatNearbyDining(bldg.name);
        }
        
        return `📍 **${bldg.name}**\n\n**Building Code:** ${bldg.code}\n**Location:** ${bldg.location}\n**Departments:** ${bldg.departments}\n**Hours:** ${bldg.hours}\n\n💡 **Student Intel:** ${bldg.tips}\n\n🗺️ **Find it:**\n• IU Campus Map: map.iu.edu\n• Google Maps: https://www.google.com/maps/search/${encodeURIComponent(bldg.name + ' Indiana University Bloomington')}\n\n**Want to know more?** Try asking:\n• "Nearby food options"\n• "Study spaces in ${bldg.nickname}"\n• "How far from [another building]?"`;
      }
    }
    
    // Second pass: building code match only (for queries like "What is IF?")
    for (const [code, bldg] of Object.entries(buildings)) {
      if (msg.includes(` ${code.toLowerCase()} `) || msg.includes(`${code.toLowerCase()}?`) || msg.includes(`${code.toLowerCase()}.`)) {
        
        // Remember this building for future context
        setLastBuilding(bldg.name);
        
        // Check if they're asking about nearby food
        if (msg.includes('food') || msg.includes('eat') || msg.includes('dining') || msg.includes('nearby')) {
          return formatNearbyDining(bldg.name);
        }
        
        return `📍 **${bldg.name}**\n\n**Building Code:** ${bldg.code}\n**Location:** ${bldg.location}\n**Departments:** ${bldg.departments}\n**Hours:** ${bldg.hours}\n\n💡 **Student Intel:** ${bldg.tips}\n\n🗺️ **Find it:**\n• IU Campus Map: map.iu.edu\n• Google Maps: https://www.google.com/maps/search/${encodeURIComponent(bldg.name + ' Indiana University Bloomington')}\n\n**Want to know more?** Try asking:\n• "Nearby food options"\n• "Study spaces in ${bldg.nickname}"\n• "How far from [another building]?"`;
      }
    }
    
    // Dining - comprehensive
    if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry') || msg.includes('dining') || msg.includes('meal')) {
      // Check for specific dining hall
      for (const [key, loc] of Object.entries(dining)) {
        if (msg.includes(key) || msg.includes(loc.name.toLowerCase())) {
          return `🍽️ **${loc.name}**\n\n**Type:** ${loc.type}\n**Location:** ${loc.location}\n**Hours:** ${loc.hours}\n**Stations:** ${loc.stations}\n**Cost:** ${loc.cost}\n\n📊 **Crowd Level:** ${loc.peak}\n\n💡 **Pro Tips:** ${loc.tips}\n\n📱 _Live menus: dining.indiana.edu_\n🔔 _Check today's specials online!_`;
        }
      }
      
      // General dining guide
      if (msg.includes('best') || msg.includes('recommend')) {
        return `🍽️ **IU Dining Recommendations**\n\n**💰 BEST VALUE:**\n• All-You-Care-To-Eat halls (Wright, Forest, Foster, Collins)\n• $13 or one meal swipe = unlimited food\n• Best for hearty meals\n\n**🌟 BEST VARIETY:**\n• IMU Food Court\n• Chick-fil-A, Panda Express, Pizza Hut, Subway, more\n• Different craving? Go here!\n\n**⚡ FASTEST:**\n• Bookmarket (Wells Library)\n• Grab-and-go options\n• Perfect between classes\n\n**🌙 LATE NIGHT:**\n• Bookmarket (open latest!)\n• Some c-stores in residence halls\n\n**🎯 LEAST CROWDED:**\n• Collins LLC Dining (hidden gem!)\n• O'Neill Cafe (breakfast)\n• Off-peak times (before 11:30am, after 2pm)\n\n**📍 BY LOCATION:**\n• Near Luddy/Kelley → IMU Food Court\n• Central campus → Wright Food Court\n• Southeast → Forest Food Court\n• Northwest → Foster Food Court\n\n💡 **Money-saving tip:** AYCTE halls = best cost per meal ratio!`;
      }
      
      // General dining overview
      return `🍽️ **Complete IU Dining Guide**\n\n**ALL-YOU-CARE-TO-EAT HALLS** (Best Value!):\n✓ Wright Dining Hall - Central campus, busiest\n✓ Forest Dining Hall - Southeast campus\n✓ McNutt Dining Hall - Northwest campus\n✓ Collins Eatery - Quieter option\n✓ Goodbody Hall Eatery - In academic building!\n→ Cost: 1 meal swipe or Dining Dollars\n\n**FOOD COURTS** (Most Variety):\n✓ **IMU Food Court** - 11 restaurants!\n  • Chick-fil-A, Panda Express, The Globe, Pizza, Tudor Room\n✓ **Bookmarket** (Wells Library basement)\n  • King's Hawaiian, BlenzBowls, soup, salad\n  • OPEN LATE for studying!\n\n**STARBUCKS** (3 Locations):\n✓ IMU Starbucks (busiest - mobile order!)\n✓ McNutt Starbucks\n✓ Read Hall Starbucks (quietest)\n\n**CAMPUS CAFES:**\n✓ Eigenmann Cafe - Rotating local cuisine!\n✓ O'Neill Cafe - All-day breakfast sandwiches\n✓ Hodge Cafe (Kelley) - Poke bowls\n✓ Godfrey Cafe - Kosher Mediterranean\n✓ Ballantine, Education, Eskenazi cafes\n\n**SPECIALTY:**\n✓ Poke by Sushi King (Hodge & Read)\n✓ Campus Stores (grab-and-go)\n\n**⏰ TIMING STRATEGY:**\n• Avoid 12-1pm (lunch chaos)\n• Avoid 5-7pm (dinner rush)\n• Best: 11am, 2pm, 8pm\n${isWeekend ? '• Weekends = check hours online!' : ''}\n\n💡 **Full menus & hours:** dining.indiana.edu`;
    }
    
    // Events
    if (msg.includes('event') || msg.includes('happening') || msg.includes('tonight') || msg.includes('weekend') || msg.includes('fun') || msg.includes('activities')) {
      return `📅 **What's Happening at IU**\n\n**FIND EVENTS:**\n🌐 **events.iu.edu** - Official calendar\n📱 Follow @IUBloomington on social media\n📧 Student org newsletters\n\n**REGULAR HIGHLIGHTS:**\n\n🎬 **IU Cinema**\nFilm screenings (often free!)\n→ cinema.indiana.edu\n\n🎨 **Eskenazi Museum**\nArt exhibits (always FREE!)\n→ Tue-Sat 10am-5pm\n\n🎵 **Musical Arts Center (MAC)**\nOpera, concerts, recitals\n→ Many free with student ID\n\n🏀 **IU Basketball**\nAssembly Hall games\n→ Student tickets free/cheap - GET THERE EARLY!\n\n🏈 **Football Games**\nMemorial Stadium\n→ Tailgating and student section\n\n🎭 **Theater Productions**\nMultiple venues on campus\n→ Student-priced tickets\n\n📚 **Union Board Events**\nIMU programs and activities\n→ Check IMU website\n\n💡 **Pro tip:** Follow IU orgs on Instagram - best way to find out what's happening!\n\n**Try asking:** "Basketball schedule" or "Free things to do"`;
    }
    
    // WiFi
    if (msg.includes('wifi') || msg.includes('internet') || msg.includes('connection')) {
      return `📶 **IU WiFi Guide**\n\n**NETWORKS:**\n• **IU-Secure** - Fast, encrypted (USE THIS!)\n• **attwifi** - Slower, guest access\n\n**SETUP:**\n1. Connect to IU-Secure\n2. Login with IU username and password\n3. Device is registered automatically\n\n**FASTEST WIFI LOCATIONS:**\n• Luddy Hall (ridiculously fast)\n• Wells Library\n• Kelley School\n• Most academic buildings\n\n**TROUBLESHOOTING:**\n• Forget network and reconnect\n• Check uits.iu.edu/wifi\n• Contact UITS: uits.iu.edu/help\n\n💡 **Pro tip:** Always use IU-Secure over attwifi for speed and security!`;
    }
    
    // Where is / directions / distance
    if (msg.includes('where') || msg.includes('find') || msg.includes('direction') || msg.includes('locate') || msg.includes('how far') || msg.includes('distance') || msg.includes('from')) {
      
      // Check if asking about distance between buildings
      if ((msg.includes('how far') || msg.includes('distance') || msg.includes('from')) && lastBuilding) {
        // Try to find the destination building
        let destination = null;
        for (const [code, bldg] of Object.entries(buildings)) {
          const nameWords = bldg.name.toLowerCase().split(' ');
          const nicknameWords = bldg.nickname.toLowerCase().split(' ');
          
          if (msg.includes(bldg.name.toLowerCase()) || 
              msg.includes(bldg.nickname.toLowerCase()) ||
              nameWords.some(word => word.length > 4 && msg.includes(word)) ||
              nicknameWords.some(word => word.length > 4 && msg.includes(word))) {
            destination = bldg;
            break;
          }
        }
        
        if (destination) {
          // Calculate approximate distance
          const from = lastBuilding.toLowerCase();
          const to = destination.nickname.toLowerCase();
          
          // Predefined distances
          if ((from.includes('luddy') && to.includes('forest')) || (from.includes('forest') && to.includes('luddy'))) {
            return `🚶 **Walking Distance:**\n\n**${lastBuilding} → ${destination.name}**\n⏱️ Approximately **10-12 minutes walk**\n\n**Route:**\n• Exit ${lastBuilding}\n• Head southeast on 10th St\n• Walk to Forest Quad area\n• ~0.5 miles\n\n**Tips:**\n• Consider taking campus bus if in a hurry\n• Route E serves this area\n• Pleasant walk through campus!\n\n🗺️ Get exact directions: https://www.google.com/maps/dir/${encodeURIComponent(lastBuilding + ' IU')}/${encodeURIComponent(destination.name + ' IU')}`;
          }
          
          if ((from.includes('luddy') && to.includes('imu')) || (from.includes('imu') && to.includes('luddy'))) {
            return `🚶 **Walking Distance:**\n\n**${lastBuilding} → ${destination.name}**\n⏱️ Approximately **5-7 minutes walk**\n\n**Route:**\n• Very close! Just down 7th Street\n• ~0.3 miles\n\n**Tips:**\n• Easy walk between classes\n• Grab food at IMU between Luddy classes\n\n🗺️ Get exact directions: https://www.google.com/maps/dir/${encodeURIComponent(lastBuilding + ' IU')}/${encodeURIComponent(destination.name + ' IU')}`;
          }
          
          // Default response for any building pair
          return `🚶 **Walking Distance:**\n\n**${lastBuilding} → ${destination.name}**\n\n**Estimated Time:**\n• Central campus buildings: 5-10 minutes\n• Cross-campus: 15-20 minutes\n• To athletic complex: 15-20 minutes\n\n**Get exact directions:**\n🗺️ Google Maps: https://www.google.com/maps/dir/${encodeURIComponent(lastBuilding + ' IU')}/${encodeURIComponent(destination.name + ' IU')}\n🗺️ IU Campus Map: map.iu.edu\n\n**Tips:**\n• 10 minutes between classes is usually enough\n• Consider campus bus for longer distances\n• Track live buses with IU Mobile app`;
        }
      }
      
      // General distance info
      if (msg.includes('how far') || msg.includes('distance')) {
        return `🚶 **Walking Distances at IU:**\n\n**Quick Reference:**\n• Luddy ↔ IMU: ~5-7 min walk\n• Luddy ↔ Wells Library: ~3-5 min\n• Luddy ↔ Kelley: ~7-10 min\n• Luddy ↔ Forest: ~10-12 min\n• IMU ↔ Wells: ~5 min\n• IMU ↔ Kelley: ~3 min\n• Wells ↔ Kelley: ~2-3 min\n• Any building ↔ Assembly Hall: ~15-20 min\n\n**💡 General Rules:**\n• Central campus buildings: 5-10 min apart\n• Campus to athletic complex: 15-20 min\n• East to west campus: 20-25 min\n• Average walking speed: 15-20 min per mile\n\n**Tips:**\n• Use Google Maps for exact routes\n• Campus bus for longer distances\n• Most classes 10 min apart (enough time!)\n• Leave extra time in winter/rain\n\n💡 **Ask:** "Where is [building]?" first, then "How far from [another building]?" for specific distances!`;
      }
      
      return `📍 **Finding Buildings:**\n\n**RESOURCES:**\n• map.iu.edu - Interactive campus map\n• IU Mobile app - Walking directions\n• Google Maps - Works well for IU\n\n**QUICK REFERENCES:**\n• Luddy Hall (IF) - 10th and Fee Lane\n• Wells Library (LI) - East 10th St\n• IMU (UB) - East 7th St\n• Kelley (HH) - East 10th St\n• SRSC (RB) - Near Assembly Hall\n\n**💡 TIPS:**\n• Building codes (like IF, LI) are on your class schedule\n• Room numbers: First digit = floor\n• Ask me about specific buildings!\n• Most buildings 10-15 min walk from Sample Gates\n\n**Try asking:** "Where is Ballantine Hall?" or "What's in Simon Hall?" or "How far from Luddy to IMU?"`;
    }
    
    // Gym/fitness
    if (msg.includes('gym') || msg.includes('workout') || msg.includes('fitness') || msg.includes('rec') || msg.includes('srsc')) {
      return `🏋️ **IU SRSC (Student Rec Center):**\n\n**Location:** Near Assembly Hall (south campus)\n**Code:** RB\n\n**Facilities:**\n• Multi-level fitness center\n• Indoor track\n• Pool (requires swim test)\n• Basketball/volleyball courts\n• Rock climbing wall\n• Group fitness classes\n\n**Hours:** Check iurec.iu.edu for current hours\n\n**TIPS:**\n• Least crowded: 2-4pm weekdays, Sunday mornings\n• Most crowded: 4-7pm weekdays\n• Free with student ID!\n• Bring towel and water bottle\n• Lockers available (bring your own lock)\n\n💡 **First time?** Take the facility tour or ask staff - they're super helpful!`;
    }
    
    // General building list
    if (msg.includes('list') && msg.includes('building')) {
      return `🏛️ **Major IU Buildings:**\n\n**Academic:**\n• Luddy Hall (IF) - Informatics and CS\n• Kelley (HH) - Business\n• Ballantine (BH) - Liberal arts\n• Wells Library (LI) - Main library\n• O'Neill (PV) - Public affairs\n\n**Student Services:**\n• IMU (UB) - Student union\n• SRSC (RB) - Rec center\n• Health Center (HC) - Medical\n• Student Building (SB) - Advising\n\n**Arts:**\n• Musical Arts Center (MC)\n• Fine Arts (FA)\n• Eskenazi Museum (FV)\n\n**Athletics:**\n• Assembly Hall (AS) - Basketball\n• Memorial Stadium (MS) - Football\n\n💡 I know 100+ buildings - ask about any specific one!`;
    }
    
    // Basketball/sports
    if (msg.includes('basketball') || msg.includes('game') || msg.includes('sport') || msg.includes('hoosier')) {
      return `🏀 **IU Sports and Games**\n\n**BASKETBALL (The Big One!):**\n🏟️ Assembly Hall games\n🎟️ Student tickets: FREE or very cheap\n⏰ Get there EARLY for big games\n🔴 Student section = AMAZING atmosphere\n📅 Check iuhoosiers.com for schedule\n\n**FOOTBALL:**\n🏟️ Memorial Stadium\n🎟️ Student tickets available\n🎉 Tailgating before games\n🍔 Game day atmosphere\n\n**OTHER SPORTS (Most FREE with ID):**\n⚽ Soccer - Armstrong Stadium\n🏐 Volleyball - Wilkinson Hall\n⚾ Baseball - Bart Kaufman Field\n\n**INTRAMURAL SPORTS:**\n📝 Sign up through IU Rec Sports\n🏃 Join teams or play pickup games\n💪 Great way to stay active and meet people\n\n💡 **Pro tip:** IU Basketball games are a MUST experience. The atmosphere is electric!`;
    }
    
    // Parking
    if (msg.includes('park') || msg.includes('car') || msg.includes('drive')) {
      return `🚗 **Parking at IU**\n\n**STUDENT PARKING:**\n• Requires parking permit\n• Apply through parking.iu.edu\n• Limited spots - apply early!\n• Permits by zone (A, C, E, etc.)\n\n**VISITOR PARKING:**\n• Parking garages (pay by hour)\n• Metered street parking\n• Some lots allow hourly parking\n\n**FREE OPTIONS:**\n• Limited free street parking (check signs!)\n• Some residential areas (time limits)\n\n**GARAGES:**\n• Fee Lane Garage\n• Poplars Garage\n• Union Street Garage\n• Atwater Garage\n\n**TIPS:**\n• Campus is VERY walkable - consider not having a car\n• Parking tickets are expensive!\n• Check signs carefully\n• Bus system is free with ID\n\n💡 **Reality check:** Most students don't need cars on campus!`;
    }
    
    // Default helpful response
    return `I'm your IU campus AI assistant! I can help with:\n\n• **Building locations** - "Where is Luddy Hall?"\n• **Dining info** - "What's open for lunch?"\n• **Study spots** - "Quiet places to study"\n• **Campus life** - Events, activities, tips\n• **Getting around** - Buses, directions\n\nI have detailed info on 100+ buildings and all campus resources!\n\n**Try asking something specific** or type 'help' for more options! 🎓`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.role === 'user' ? 'You' : 'Hoosier Helper'}:\n${msg.content}\n`
    ).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoosier-helper-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const QuickAction = ({ icon: Icon, label, query }) => (
    <button
      onClick={() => setInput(query)}
      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-full hover:border-red-600 hover:bg-red-50 transition-all text-sm font-medium whitespace-nowrap"
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 via-white to-cream-50'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white p-6 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={32} className="text-yellow-300 animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold">Hoosier Helper</h1>
                <p className="text-red-100 text-sm">100+ Buildings • Real IU Data • Powered by Claude Sonnet 4.5</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportChat}
                className="p-2 bg-red-800 hover:bg-red-900 rounded-full transition-all"
                title="Export Chat"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-red-800 hover:bg-red-900 rounded-full transition-all"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 shadow-sm`}>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <QuickAction icon={Building2} label="Find Building" query="Where is Luddy Hall?" />
            <QuickAction icon={Utensils} label="Dining" query="What dining is open now?" />
            <QuickAction icon={Book} label="Study Spots" query="Best quiet study spots" />
            <QuickAction icon={Coffee} label="Coffee" query="Where can I get coffee?" />
            <QuickAction icon={Navigation} label="Campus Bus" query="Tell me about campus buses" />
            <QuickAction icon={Calendar} label="Events" query="What's happening this weekend?" />
            <QuickAction icon={Users} label="Rec Center" query="Tell me about the SRSC" />
            <QuickAction icon={Zap} label="Quick Tips" query="Best WiFi spots" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                    : darkMode 
                    ? 'bg-gray-800 border-2 border-gray-700 text-gray-100 shadow-sm'
                    : 'bg-white border-2 border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <div className="text-sm">
                  {renderMessage(msg.content)}
                </div>
                <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-red-200' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 rounded-2xl px-5 py-3 shadow-sm`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t-2 p-4 shadow-lg`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about buildings, dining, study spots, events..."
                className={`w-full pl-11 pr-5 py-3 border-2 ${darkMode ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'border-gray-300 bg-white'} rounded-full focus:outline-none focus:border-red-600 text-sm`}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
            >
              <Send size={18} />
              Send
            </button>
          </div>
          <p className={`text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
            Claude Builder Club Hackathon • Built by Neeha Agrawal • Powered by Claude Sonnet 4.5 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default HoosierHelper;