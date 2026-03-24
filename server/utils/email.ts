import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "Zielona Przesadzka <onboarding@resend.dev>";
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function sendEmailVerificationEmail(to: string, token: string) {
  const link = `${APP_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Potwierdź adres e-mail — Zielona Przesadzka",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="color: #1e3d2f; margin-bottom: 8px;">Potwierdź adres e-mail</h2>
        <p style="color: #5a7a66; margin-bottom: 24px;">
          Kliknij poniższy przycisk, aby potwierdzić swój adres e-mail w Zielonej Przesadzce.
          Link jest ważny przez <strong>24 godziny</strong>.
        </p>
        <a href="${link}"
           style="display: inline-block; background: #52916b; color: #fff; padding: 14px 28px;
                  border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Potwierdź e-mail
        </a>
        <p style="color: #8a9e94; font-size: 13px; margin-top: 24px;">
          Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = `${APP_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Resetowanie hasła — Zielona Przesadzka",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="color: #1e3d2f; margin-bottom: 8px;">Resetowanie hasła</h2>
        <p style="color: #5a7a66; margin-bottom: 24px;">
          Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w Zielonej Przesadzce.
          Kliknij poniższy przycisk, aby ustawić nowe hasło. Link jest ważny przez <strong>1 godzinę</strong>.
        </p>
        <a href="${link}"
           style="display: inline-block; background: #52916b; color: #fff; padding: 14px 28px;
                  border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 15px;">
          Resetuj hasło
        </a>
        <p style="color: #8a9e94; font-size: 13px; margin-top: 24px;">
          Jeśli to nie Ty wysłałeś tę prośbę, zignoruj tę wiadomość.
        </p>
      </div>
    `,
  });
}
