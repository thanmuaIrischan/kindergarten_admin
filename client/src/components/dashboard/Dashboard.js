import React from 'react';
import '../../styles/Dashboard.css';

const Dashboard = () => {
    const images = {
        classroom: "https://res.cloudinary.com/dv0ehr5z7/image/upload/v1733249512/449038487_122155649030155297_1244987271377051936_n_s0vlks.jpg",
        activities: "https://res.cloudinary.com/dv0ehr5z7/image/upload/v1733249511/449034080_122155649330155297_2195487123612299216_n_cipbvy.jpg",
        learning: "https://res.cloudinary.com/dv0ehr5z7/image/upload/v1733249511/448962128_122155649360155297_2428165880131870402_n_bbs0zd.jpg",
        hero: "https://res.cloudinary.com/dv0ehr5z7/image/upload/v1746256260/Screenshot_2025-05-03_141028_sqo8wn.png"
    };

    return (
        <div className="school-intro">
            <section className="hero-section">
                <h1>Welcome to Star Kindergarten</h1>
                <h3>Chào mừng đến với Trường Mầm Non Ngôi Sao</h3>
                <p className="subtitle">Where Every Child's Journey Begins</p>
                <div className="hero-image">
                    <img src={images.hero} alt="Our Kindergarten" />
                </div>
            </section>

            <section className="features-grid">
                <div className="feature-card">
                    <img src={images.learning} alt="Interactive Learning" className="feature-image" />
                    <h3>Interactive Learning</h3>
                    <p>Our curriculum focuses on hands-on activities and creative exploration to foster natural curiosity and love for learning.</p>
                </div>
                <div className="feature-card">
                    <img src={images.activities} alt="Safe Environment" className="feature-image" />
                    <h3>Safe Environment</h3>
                    <p>We provide a secure and nurturing environment where children can thrive and parents can have peace of mind.</p>
                </div>
                <div className="feature-card">
                    <img src={images.classroom} alt="Modern Facilities" className="feature-image" />
                    <h3>Modern Facilities</h3>
                    <p>Our classrooms are equipped with modern educational tools and comfortable furniture to create an optimal learning environment.</p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-content">
                    <h2>About Our School</h2>
                    <p>At Sunshine Kindergarten, we believe that every child is unique and deserves an education that nurtures their individual potential. Our modern facilities and dedicated staff create an engaging and supportive environment where children can develop essential skills while having fun.</p>
                    <div className="key-points">
                        <div className="point">
                            <span className="point-number">15+</span>
                            <span className="point-label">Years of Excellence</span>
                        </div>
                        <div className="point">
                            <span className="point-number">1:8</span>
                            <span className="point-label">Teacher-Student Ratio</span>
                        </div>
                        <div className="point">
                            <span className="point-number">98%</span>
                            <span className="point-label">Parent Satisfaction</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="programs-section">
                <h2>Our Programs</h2>
                <div className="programs-grid">
                    <div className="program-card">
                        <h4>Early Learners</h4>
                        <p>Ages 2-3 years</p>
                        <ul>
                            <li>Basic motor skills development</li>
                            <li>Introduction to social interaction</li>
                            <li>Creative play and exploration</li>
                        </ul>
                    </div>
                    <div className="program-card">
                        <h4>Pre-Kindergarten</h4>
                        <p>Ages 3-4 years</p>
                        <ul>
                            <li>Language and literacy foundations</li>
                            <li>Number concepts and patterns</li>
                            <li>Arts and crafts activities</li>
                        </ul>
                    </div>
                    <div className="program-card">
                        <h4>Kindergarten</h4>
                        <p>Ages 4-5 years</p>
                        <ul>
                            <li>Advanced cognitive development</li>
                            <li>Pre-writing and reading skills</li>
                            <li>Science and nature exploration</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <h2>Visit Our School</h2>
                <p>We'd love to show you around and answer any questions you may have about our programs.</p>
                <div className="contact-info">
                    <div className="info-item">
                        <strong>Address:</strong>
                        <p>123 Education Street, Sunshine City, SC 12345</p>
                    </div>
                    <div className="info-item">
                        <strong>Phone:</strong>
                        <p>+1 (555) 123-4567</p>
                    </div>
                    <div className="info-item">
                        <strong>Email:</strong>
                        <p>info@sunshinekindergarten.edu</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard; 