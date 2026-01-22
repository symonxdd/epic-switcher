import PageHeader from '../components/PageHeader';
import styles from './FAQ.module.css';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

function FAQ() {
  const faqData = [
    {
      question: "I accidentally logged out in the Epic Games Launcher. What now?",
      answer: "Don't worry! Simply log back into the Epic Games Launcher and come back to Epic Switcher. The app will automatically detect your session and refresh the session key for you."
    },
    {
      question: "Why was I logged out after some time?",
      answer: "For security reasons, Epic Games will occasionally log you out after some time has passed. This happens regardless of whether Epic Switcher is used or not. When it happens, simply log in again through the Epic Games Launcher and come back; the app will automatically renew the session token."
    },
    {
      question: "Is Epic Switcher safe to use?",
      answer: "Yes. Epic Switcher is safe because it only manages local file data on your computer. It never touches the internet to share info or talk to Epic's servers. By automating a process you could technically do by hand in a text editor, it maintains a small, secure footprint on your system."
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
      question: "Does it work with a 2FA-enabled account?",
      answer: "Yes! Since the app uses session keys from the launcher, you only need to handle 2FA when you first log into the Epic Games Launcher. Once the session is saved in Epic Switcher, you can swap back to it without needing to re-enter 2FA codes."
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <PageHeader title="FAQ" />

      <div className={styles.description}>
        Common questions about Epic Switcher's safety, security, and how it works.
      </div>

      <div className={styles.container}>
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
    </div>
  );
}

export default FAQ;
