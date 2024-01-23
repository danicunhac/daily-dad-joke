import { Joke } from '@/types';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface EmailTemplateProps {
  joke: Joke;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  joke,
}) => {
  const previewText = `Check today's joke!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[8px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {joke.content.question}
            </Heading>
            <Text className="text-black text-[16px] text-center leading-[24px]">
              {joke.content.answer}
            </Text>
            <Section className="mt-[32px]"></Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 uppercase"
                href={`https://dailydadjoke.app`}
              >
                Check List of Jokes
              </Button>
            </Section>
            <Text className="text-black text-[14px] text-center leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link
                href={`https://dailydadjoke.app`}
                className="text-blue-600 no-underline"
              >
                {`https://dailydadjoke.app`}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This email was intended to make you laugh. This joke was sent from
              The Daily Dad Joke. If you were not expecting this, you can ignore
              this email. If you are concerned about your account&apos;s safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
