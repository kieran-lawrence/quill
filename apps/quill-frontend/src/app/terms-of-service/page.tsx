'use client'
import styled from 'styled-components'
import { Header } from '../components/home/Header'
import Link from 'next/link'

export default function TermsOfServicePage() {
    return (
        <STermsOfService>
            <Header />
            <h2>Terms of Service</h2>
            <h3>Effective Date: 11th November 2024</h3>
            <p>
                Welcome to Quill! These Terms of Service (&quot;Terms&quot;)
                govern your use of Quill, a web-based, real-time chat
                application that enables private and group messaging (the
                &quot;Service&quot;) provided by Quill (&quot;we,&quot;
                &quot;us,&quot; &quot;our&quot;). By accessing or using Quill,
                you agree to comply with and be bound by these Terms. If you do
                not agree with any part of these Terms, please do not use our
                Service.
            </p>
            <ol>
                <li>
                    <h4>Eligibility</h4> You must be at least 13 years old to
                    use Quill. If you are under 18, you must have the consent of
                    a parent or guardian to use the Service. By using Quill, you
                    represent and warrant that you meet the eligibility
                    requirements.{' '}
                </li>
                <li>
                    <h4>Account Creation</h4> To access certain features of
                    Quill, you may be required to create an account. You agree
                    to provide accurate, current, and complete information
                    during the registration process and to update such
                    information as necessary. You are responsible for
                    maintaining the confidentiality of your account credentials
                    and for all activities that occur under your account.{' '}
                </li>
                <li>
                    <h4>Use of the Service</h4> You agree to use Quill only for
                    lawful purposes and in accordance with these Terms. You
                    agree not to use the Service to: Engage in any illegal
                    activity or violate any applicable laws or regulations.
                    Harass, abuse, defame, or threaten other users. Post,
                    transmit, or share any content that is offensive, obscene,
                    defamatory, discriminatory, or otherwise inappropriate.
                    Impersonate any person or entity, or falsely represent your
                    affiliation with any person or entity. Interfere with or
                    disrupt the Service or the servers or networks connected to
                    Quill.{' '}
                </li>
                <li>
                    <h4>Privacy and Data</h4> Use Your privacy is important to
                    us. Please refer to our{' '}
                    <Link href="/privacy-policy">Privacy Policy</Link> for
                    detailed information about how we collect, use, and protect
                    your personal information. By using Quill, you consent to
                    the collection and use of your information as described in
                    the Privacy Policy.{' '}
                </li>
                <li>
                    <h4>User Content</h4> You are responsible for the content
                    you post, send, or receive through Quill. You retain
                    ownership of your content, but by using the Service, you
                    grant us a worldwide, royalty-free, and non-exclusive
                    license to use, display, and distribute your content as
                    necessary to provide and improve the Service. You agree not
                    to post or share content that: Violates any intellectual
                    property rights, privacy rights, or other legal rights.
                    Contains harmful or malicious code (e.g., viruses, malware).
                    Violates any of Quill’s community guidelines or applicable
                    laws. We reserve the right to remove any content that
                    violates these Terms or is deemed inappropriate at our
                    discretion.{' '}
                </li>
                <li>
                    <h4>Group Chats and Communications</h4> Quill allows you to
                    participate in group chats and messaging. You agree to
                    respect the privacy and rights of other participants. You
                    understand that messages in group chats may be visible to
                    multiple users, and you are responsible for the content you
                    share in these settings. We recommend you exercise caution
                    and avoid sharing sensitive or personal information in group
                    chats.
                </li>
                <li>
                    <h4>Termination and Suspension</h4> We may suspend or
                    terminate your access to Quill if you violate these Terms or
                    engage in conduct that we deem harmful or inappropriate. You
                    may also terminate your account at any time by following the
                    instructions in the app or contacting our support team. Upon
                    termination of your account, all rights granted to you under
                    these Terms will immediately cease, and you must stop using
                    the Service.
                </li>
                <li>
                    <h4>Intellectual Property</h4> Quill and its associated
                    content, including but not limited to the logo, design,
                    software, and all intellectual property rights, are owned by
                    Quill or its licensors. You are granted a limited,
                    non-exclusive, non-transferable license to use Quill for
                    personal, non-commercial purposes in accordance with these
                    Terms. You agree not to copy, modify, distribute, sell, or
                    otherwise exploit any of Quill’s intellectual property
                    without our prior written consent.{' '}
                </li>
                <li>
                    <h4>Disclaimer of Warranties</h4> Quill is provided &quot;as
                    is&quot; and &quot;as available,&quot; without any
                    warranties of any kind, either express or implied, including
                    but not limited to the implied warranties of
                    merchantability, fitness for a particular purpose, or
                    non-infringement. We do not warrant that Quill will be
                    uninterrupted, error-free, or free of harmful components.{' '}
                </li>
                <li>
                    <h4>Limitation of Liability</h4> To the fullest extent
                    permitted by law, Quill will not be liable for any direct,
                    indirect, incidental, special, consequential, or punitive
                    damages, or any loss of profits, data, or goodwill, arising
                    out of or related to your use of Quill.{' '}
                </li>
                <li>
                    <h4>Indemnification</h4> You agree to indemnify and hold
                    harmless Quill, its affiliates, employees, officers, and
                    directors from any claims, losses, liabilities, damages, or
                    expenses (including legal fees) arising out of your use of
                    the Service or any violation of these Terms.{' '}
                </li>
                <li>
                    <h4>Changes to These Terms</h4> We reserve the right to
                    update or modify these Terms at any time. Any changes will
                    be posted on this page with an updated &quot;Effective
                    Date.&quot; By continuing to use Quill after the changes are
                    posted, you agree to the updated Terms.
                </li>
            </ol>
            <p>
                By using Quill, you acknowledge that you have read, understood,
                and agree to these Terms of Service.
            </p>{' '}
        </STermsOfService>
    )
}

const STermsOfService = styled.div`
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
`
