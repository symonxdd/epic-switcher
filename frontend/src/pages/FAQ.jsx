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
      question: "Is Epic Switcher safe to use?",
      answer: "Yes, Epic Switcher is safe. It only modifies a local configuration file (`GameUserSettings.ini`) to swap session keys. It doesn't interact with the Epic Games servers directly, nor does it collect or share any of your personal data."
    },
    {
      question: "Will I get banned for using this?",
      answer: "No. Epic Switcher simply automates a process that you could do manually by editing a text file. It is not a cheat, and it doesn't give you any unfair advantage in games. It simply helps you manage multiple accounts more easily."
    },
    {
      question: "How do I add a new account?",
      answer: "To add a new account, first log out of your current account in the Epic Games Launcher, then log in with the new account. Epic Switcher will automatically detect the new session and ask if you want to save it."
    },
    {
      question: "Where is my account data stored?",
      answer: "Your account data (session keys and User IDs) is stored locally on your computer in a JSON file within the app's data directory. No data is ever sent to any external servers."
    },
    {
      question: "Does it work with 2FA?",
      answer: "Yes! Since the app uses session keys from the launcher, you only need to handle 2FA when you first log into the Epic Games Launcher. Once the session is saved in Epic Switcher, you can swap back to it without needing to re-enter 2FA codes."
    },
    {
      question: "Why was I logged out after some time?",
      answer: "Epic Games enforces security measures that may invalidate session keys after a certain period of inactivity or for other security reasons. When this happens, you will need to log in again through the Epic Games Launcher. This is a behavior of the Epic Games ecosystem that Epic Switcher cannot bypass or control."
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <PageHeader title="FAQ" />
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
      <div className={styles.madeWith}>
        Meticulously engineered with<span className={styles.heart}>❤️‍🩹</span> by Symon
      </div>
    </div>
  );
}

export default FAQ;
