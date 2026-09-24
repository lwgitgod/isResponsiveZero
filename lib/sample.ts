// Reference matter used to prefill the UI and by scripts/run-e2e.ts.

export const SAMPLE_COMPLAINT = `The company belongs to the Plaintiff, although it was formally incorporated by the Defendant on the Plaintiff's behalf. After incorporation, the Defendant gained access to the company's funds and embezzled money from the company.

The Plaintiff is currently compiling documents and other evidence to establish the Plaintiff's ownership of the company and to substantiate the Defendant's embezzlement of company funds.

Parties (placeholder mapping used in the Requests for Production):
[COMPANY NAME] = Brightline Ventures, Inc.
[PERSON A] = Plaintiff, Alex Rivera
[PERSON B] = Defendant, Jordan Blake (also controls Blake Holdings LLC)`;

const REQUESTS: string[] = [
  "REQUEST NO. 1 All documents reflecting or relating to the ownership of [COMPANY NAME], including documents identifying shareholders, beneficial owners, founders, members, or persons claiming an ownership interest.",
  "REQUEST NO. 2 All stock certificates, stock ledgers, capitalization tables, shareholder registers, subscription agreements, stock purchase agreements, or other records reflecting the issuance, transfer, ownership, or allocation of shares or equity interests.",
  "REQUEST NO. 3 All agreements, communications, emails, text messages, or other documents concerning any agreement or understanding regarding the percentage ownership of [COMPANY NAME] by [PERSON A] and [PERSON B].",
  "REQUEST NO. 4 All documents reflecting money, property, intellectual property, services, labor, or other consideration contributed by [PERSON A] or [PERSON B] in connection with an ownership interest.",
  "REQUEST NO. 5 All corporate formation and organizational documents, including articles of incorporation, bylaws, organizational minutes, board resolutions, shareholder resolutions, written consents, and amendments.",
  "REQUEST NO. 6 All documents and communications identifying [PERSON A] as an owner, shareholder, founder, co-founder, partner, or equity holder.",
  "REQUEST NO. 7 All documents and communications in which [PERSON B] represented the ownership interests or ownership percentages of [COMPANY NAME] to any third party.",
  "REQUEST NO. 8 All documents reflecting distributions, dividends, payments, withdrawals, transfers, loans, or other transfers of money or property from [COMPANY NAME] to [PERSON B] or an account/entity controlled by [PERSON B].",
  "REQUEST NO. 9 All bank statements, transaction records, general ledgers, accounting records, and financial statements reflecting funds received by or transferred from [COMPANY NAME].",
  "REQUEST NO. 10 All documents concerning any dispute, disagreement, modification, transfer, cancellation, dilution, or termination of an ownership interest claimed by [PERSON A].",
];

// Three RFP boxes: requests 1-4, 5-7, 8-10. All ten are sent.
export const SAMPLE_RFP_BOXES: [string, string, string] = [
  REQUESTS.slice(0, 4).join("\n"),
  REQUESTS.slice(4, 7).join("\n"),
  REQUESTS.slice(7).join("\n"),
];
