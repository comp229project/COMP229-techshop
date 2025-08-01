import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';
import '../assets/styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, url: '' },
  ];

  return (
    <footer className='border-top border-3'>
      <Container>
        <Row>
          <Col className='text-center p-2'>
            <p>Z.US &copy; {currentYear}</p>
            <div>
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ color: '#657A8C' }}
                >
                  <link.icon size={30} />
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
