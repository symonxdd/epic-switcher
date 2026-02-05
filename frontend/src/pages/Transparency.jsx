import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import styles from './Transparency.module.css';
import { FaInfoCircle, FaLock, FaGithub, FaGlobe, FaShieldAlt, FaRobot, FaExternalLinkAlt, FaQuestionCircle, FaEye, FaChevronDown } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { OpenDirectory } from '../../wailsjs/go/services/SystemService';
import { BrowserOpenURL } from '../../wailsjs/runtime';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import VerifyWithAI from '../components/VerifyWithAI';

function Transparency() {
  const [showPrecaution, setShowPrecaution] = useState(false);

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
      answer: "Epic Switcher simply automates a process that you could do manually by editing a text file. It is not a cheat, and it doesn't give you any unfair advantage in games. It simply helps you manage multiple accounts more easily."
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

  const headerActions = (
    <div className={styles.headerActions}>
      <span className={styles.headerLink} onClick={() => handleOpenURL('https://github.com/symonxdd/epic-switcher')}>
        <FaGithub /> GitHub
      </span>
      <span className={styles.headerLink} onClick={() => handleOpenURL('https://epic-switcher.vercel.app/')}>
        <FaGlobe /> Website
      </span>
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      <PageHeader title="Trust & Transparency" rightElement={headerActions} />
      <div className={styles.pageSubtitle}>Because security is non-negotiable.</div>

      <div className={styles.container}>
        {/* How It Works Section */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}><FaInfoCircle /> How it works</h2>

          <div className={styles.guideList}>
            <div className={styles.guideItem}>
              <div className={styles.guideDot}></div>
              <p className={styles.paragraph} style={{ margin: 0 }}>
                Epic Games Launcher persists the active login session to a file called{' '}
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
                Epic Switcher reads this file, extracts the session key, and stores it
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
          </div>

          <div style={{ marginTop: '1rem' }}>
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
        </div>

        {/* Fundamental Principles */}
        <div className={styles.principlesList}>
          <div className={styles.tooltipTrigger}>
            <div className={styles.principleItem}>
              <div className={styles.iconBox}><FaLock /></div>
              <span className={styles.principleText}>Works Offline</span>
            </div>
            <div className={styles.customTooltip}>Epic Switcher functions entirely locally. The only internet connectivity is to check for updates on the Settings page.</div>
          </div>

          <div className={styles.tooltipTrigger}>
            <div className={styles.principleItem}>
              <div className={styles.iconBox}><FaShieldAlt /></div>
              <span className={styles.principleText}>No Data Collection</span>
            </div>
            <div className={styles.customTooltip}>Your session keys and User IDs never leave your computer. We don't track, log, or share any of your account data.</div>
          </div>

          <div className={styles.tooltipTrigger}>
            <div className={styles.principleItem}>
              <div className={styles.iconBox}><FaEye /></div>
              <span className={styles.principleText}>Open Source</span>
            </div>
            <div className={styles.customTooltip}>Every line of code is public. We encourage technical users to audit the source on GitHub.</div>
          </div>
        </div>

        {/* AI Audit Section */}
        <VerifyWithAI className="mb-8" />

        {/* FAQ Section */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '0.75rem' }}><FaQuestionCircle /> Frequently Asked Questions</h2>
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


      </div >
    </div >
  );
}

export default Transparency;
