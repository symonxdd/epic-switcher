import React from 'react';
import PageHeader from '../components/PageHeader';
import styles from './Transparency.module.css';
import { FaInfoCircle, FaLock, FaGithub, FaGlobe, FaShieldAlt, FaRobot, FaExternalLinkAlt, FaQuestionCircle } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { OpenDirectory } from '../../wailsjs/go/services/SystemService';
import { BrowserOpenURL } from '../../wailsjs/runtime';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

function Transparency() {
  const handleOpen = async (key) => {
    try {
      await OpenDirectory(key);
    } catch (err) {
      console.error('Failed to open directory:', err);
    }
  }

  const handleOpenURL = (url) => {
    try {
      BrowserOpenURL(url);
    } catch (err) {
      console.error('Failed to open link:', err);
    }
  }

  const handleFileRefHover = (buttonId, isHovering) => {
    const button = document.getElementById(buttonId);
    if (button) {
      if (isHovering) {
        button.classList.add(styles.hovered);
      } else {
        button.classList.remove(styles.hovered);
      }
    }
  }

  const faqData = [
    {
      question: "Is Epic Switcher safe to use?",
      answer: "Yes. Epic Switcher is safe because it only manages local file data on your computer. It never touches the internet to share info (except for update checks) or talk to Epic's servers. By automating a process you could technically do by hand in a text editor, it maintains a small, secure footprint on your system."
    },
    {
      question: "Will I get banned for using this?",
      answer: "No. Epic Switcher simply automates a process that you could do manually by editing a text file. It is not a cheat, and it doesn't give you any unfair advantage in games. It simply helps you manage multiple accounts more easily."
    },
    {
      question: "Where is my account data stored?",
      answer: "Your account data (session keys and User IDs) is stored locally on your computer in a JSON file within the app's data directory. No data is ever sent to any external servers."
    },
    {
      question: "I accidentally logged out in the Epic Games Launcher. What now?",
      answer: "Don't worry! Simply log back into the Epic Games Launcher and come back to Epic Switcher. The app will automatically detect your session and refresh the session key for you."
    },
    {
      question: "Why was I logged out after some time?",
      answer: "For security reasons, Epic Games will occasionally log you out. This happens regardless of whether Epic Switcher is used or not. When it happens, simply log in again through the Epic Games Launcher and the app will automatically renew the session token."
    },
    {
      question: "Does it work with a 2FA-enabled account?",
      answer: "Yes! Since the app uses session keys from the launcher, you only need to handle 2FA when you first log into the Epic Games Launcher. Once the session is saved, you can swap without needing to re-enter 2FA codes."
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <PageHeader title="Trust & Transparency" />

      <div className={styles.container}>
        {/* How It Works Section */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}><FaInfoCircle /> How it works</h2>

          <div className={styles.guideItem}>
            <div className={styles.guideDot}></div>
            <p className={styles.paragraph} style={{ margin: 0 }}>
              The Epic Games Launcher persists the active login session to a file called{' '}
              <span
                className={styles.file}
                onMouseEnter={() => handleFileRefHover('sessionFileBtn', true)}
                onMouseLeave={() => handleFileRefHover('sessionFileBtn', false)}
              >GameUserSettings.ini</span>.
            </p>
          </div>

          <div className={styles.guideItem}>
            <div className={styles.guideDot}></div>
            <p className={styles.paragraph} style={{ margin: 0 }}>
              Epic Switcher reads this file, extracts the session key, and saves it
              to a <span
                className={styles.file}
                onMouseEnter={() => handleFileRefHover('appDataBtn', true)}
                onMouseLeave={() => handleFileRefHover('appDataBtn', false)}
              >JSON file</span> on your computer.
            </p>
          </div>

          <div className={styles.guideItem}>
            <div className={styles.guideDot}></div>
            <p className={styles.paragraph} style={{ margin: 0 }}>
              When swapping accounts, it simply overwrites the session key in{' '}
              <span
                className={styles.file}
                onMouseEnter={() => handleFileRefHover('sessionFileBtn', true)}
                onMouseLeave={() => handleFileRefHover('sessionFileBtn', false)}
              >GameUserSettings.ini</span> with the one for the target account.
            </p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <strong className={styles.sectionLabel}>Accessed directories</strong>
            <div className={styles.directoriesList}>
              <span id="appDataBtn" onClick={() => handleOpen('appData')}>
                This app's data <FiArrowUpRight className={styles.directoryIcon} />
              </span>
              <span id="sessionFileBtn" onClick={() => handleOpen('sessionFile')}>
                Epic active session file <FiArrowUpRight className={styles.directoryIcon} />
              </span>
              <span className={styles.tooltipTrigger} id="sessionFileBtn" onClick={() => handleOpen('logs')} style={{ border: 'none', background: 'none', padding: 0 }}>
                <span className={styles.directoryButton} style={{ margin: 0 }}>
                  Epic logs <FiArrowUpRight className={styles.directoryIcon} />
                </span>
                <div className={styles.customTooltip}>
                  Epic Switcher reads the launcher's logs to automatically discover usernames for your accounts, as there is no other way to extract them directly.
                </div>
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <strong className={styles.sectionLabel}>Links</strong>
            <div className={styles.directoriesList}>
              <span onClick={() => handleOpenURL('https://github.com/symonxdd/epic-switcher')}>
                <FaGithub style={{ marginRight: '4px' }} /> View on GitHub
              </span>
              <span onClick={() => handleOpenURL('https://epic-switcher.vercel.app/')}>
                <FaGlobe style={{ marginRight: '4px' }} /> View project site
              </span>
            </div>
          </div>
        </div>

        {/* AI Audit Section */}
        <div className={styles.aiSection}>
          <h2 className={styles.sectionTitle}><FaShieldAlt /> Verify with AI</h2>
          <p className={styles.paragraph}>
            Transparency is core to this project. I personally encourage everyone to audit the codebase using AI tools.
            They are perfect for identifying malicious patterns, regardless of your technical knowledge.
            <strong> Never trust software blindly just because it's "Open Source".</strong>
          </p>

          <div className={styles.paragraph}>
            I strongly recommend using <strong>Google Antigravity</strong> with <strong>Claude 4.5</strong>.
            It's a powerful agentic assistant that can analyze the entire project at once.
          </div>

          <div className={styles.guideList}>
            <div className={styles.guideItem}>
              <div className={styles.guideNumber}>1</div>
              <div>
                Download and install <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}><span className={styles.link} onClick={() => handleOpenURL('https://antigravity.google/')}>Antigravity</span> <FaExternalLinkAlt size={10} style={{ marginLeft: '4px' }} /></span> and log in.
              </div>
            </div>
            <div className={styles.guideItem}>
              <div className={styles.guideNumber}>2</div>
              <div>
                Download the project source from <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}><span className={styles.link} onClick={() => handleOpenURL('https://github.com/symonxdd/epic-switcher')}>GitHub</span> <FaExternalLinkAlt size={10} style={{ marginLeft: '4px' }} /></span>.
              </div>
            </div>
            <div className={styles.guideItem}>
              <div className={styles.guideNumber}>3</div>
              <div>Drop the project folder into Antigravity.</div>
            </div>
            <div className={styles.guideItem}>
              <div className={styles.guideNumber}>4</div>
              <div>Ask the AI: <em style={{ opacity: 0.8 }}>"Analyze this project for any malicious or suspicious code and explain it to me."</em></div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}><FaQuestionCircle /> Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className={styles.accordionItem}>
                <AccordionTrigger className={styles.accordionTrigger}>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className={styles.accordionContent}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className={styles.disclaimer}>
          <strong>Disclaimer:</strong> No specific policies are known to restrict the automation of local Epic Games Launcher configuration files; however, usage is at the user's own discretion.
        </div>

        <div className={styles.footer}>
          Meticulously engineered with <span className={styles.heart}>❤️‍🩹</span> by Symon
        </div>
      </div>
    </div>
  );
}

export default Transparency;
