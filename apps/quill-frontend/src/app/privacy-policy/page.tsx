'use client'

import styled from 'styled-components'
import { Header } from '../components/home/Header'

export default function PrivacyPolicyPage() {
    return (
        <SPrivacyPolicy>
            <Header />
            <h2>Privacy Policy</h2>
            <h3>Effective Date: 11th November 2024</h3>
            <p>
                At Quill, we are committed to protecting and respecting your
                privacy. This Privacy Policy explains how we collect, use, and
                safeguard your personal information when you use our web-based
                chat application (&quot;Quill,&quot; &quot;Service,&quot;
                &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By using
                Quill, you agree to the practices outlined in this Privacy
                Policy.
            </p>

            <ol>
                <li>
                    <h4>Information We Collect</h4>
                    When you use Quill, we collect the following types of
                    information:
                    <ul>
                        <h5>Personal Information</h5>
                        <li>
                            Account Information: When you register for an
                            account, we collect personal information such as
                            your name, email address, username, and password.
                        </li>
                        <li>
                            Profile Information: You may provide additional
                            details such as a profile picture, bio, or contact
                            information, which will be visible to other users
                            depending on your privacy settings.
                        </li>
                        <h5>Usage Data</h5>
                        <li>
                            Log Data: We collect information about your
                            interactions with Quill, such as your IP address,
                            browser type, operating system, device information,
                            timestamps, and the pages or features you use within
                            the Service.
                        </li>
                        <li>
                            Message Data: Quill processes the messages you send
                            and receive (including private and group messages)
                            in order to deliver the service. These messages may
                            be stored temporarily to facilitate the operation of
                            the Service.
                        </li>
                        <li>
                            Location Information: If you choose to enable
                            location-based features, we may collect information
                            about your location, though this will only be used
                            with your consent.
                        </li>
                        <li>
                            Cookies and Tracking Technologies We use cookies and
                            similar tracking technologies to enhance your
                            experience with Quill, analyze usage trends, and
                            improve our Service.
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>How We Use Your Information</h4>
                    We use the information we collect for the following
                    purposes:
                    <ul>
                        <li>
                            Providing the Service: To create and manage your
                            account, deliver messages, facilitate communication,
                            and provide all features of Quill.
                        </li>
                        <li>
                            Personalization: To personalize your experience and
                            improve the functionality and usability of the
                            Service.
                        </li>
                        <li>
                            Improving the Service: To analyze usage data and
                            improve the performance, security, and features of
                            Quill.
                        </li>
                        <li>
                            {' '}
                            Communication: To send you important notifications
                            related to your account, such as updates, security
                            alerts, and service changes.
                        </li>
                        <li>
                            Customer Support: To respond to your inquiries,
                            troubleshoot issues, and provide support.
                        </li>
                        <li>
                            Marketing and Updates: With your consent, we may
                            send you promotional communications, newsletters, or
                            updates related to Quill. You can opt out at any
                            time by following the unsubscribe instructions in
                            the email.
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>How We Protect Your Information</h4> We take the
                    security of your personal information seriously. We
                    implement reasonable technical, administrative, and physical
                    safeguards to protect the information we collect from
                    unauthorized access, use, or disclosure. However, please be
                    aware that no data transmission over the internet or
                    electronic storage system can be guaranteed to be 100%
                    secure.
                </li>
                <li>
                    <h4>Your Rights and Choices</h4>
                    You have the following rights regarding your personal
                    information:{' '}
                    <ul>
                        <li>
                            Access and Update: You may access and update your
                            account information by logging into your Quill
                            account. If you need assistance, you can contact our
                            support team.
                        </li>
                        <li>
                            Data Deletion: You may request the deletion of your
                            account and personal data by contacting us at
                            support@quill.com.au. Please note that some
                            information may need to be retained for legal,
                            security, or operational reasons.
                        </li>
                        <li>
                            Opt-Out of Marketing: If you no longer wish to
                            receive promotional emails or newsletters, you can
                            unsubscribe by following the instructions in the
                            email or contacting us directly.
                        </li>{' '}
                        <li>
                            Data Portability: You may request a copy of your
                            personal data in a structured, commonly used format
                            to transfer it to another service.{' '}
                        </li>
                        <li>
                            Cookies: You can control the use of cookies and
                            tracking technologies through your browser settings.
                            Please note that disabling cookies may affect the
                            functionality of Quill.
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>Data Retention</h4>
                    We retain your personal information for as long as necessary
                    to provide the Service, comply with legal obligations,
                    resolve disputes, and enforce our agreements. If you request
                    the deletion of your account, we will remove your personal
                    information from our active databases, but we may retain
                    certain information for legitimate business or legal
                    purposes.
                </li>
                <li>
                    <h4>Changes to This Privacy Policy</h4>
                    We reserve the right to update or modify this Privacy Policy
                    at any time. Any changes will be posted on this page with an
                    updated &quot;Effective Date.&quot; We encourage you to
                    review this Privacy Policy periodically to stay informed
                    about how we are protecting your information.
                </li>
            </ol>

            <p>
                By using Quill, you acknowledge that you have read, understood,
                and agree to this Privacy Policy.
            </p>
        </SPrivacyPolicy>
    )
}

const SPrivacyPolicy = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    text-align: justify;

    * {
        max-width: 55vw;
    }
    h4 {
        padding-bottom: 0.5rem;
    }
    li {
        padding-bottom: 1rem;
    }
    ul {
        padding-left: 2rem;
        padding: 0.5rem 0;
    }
`
