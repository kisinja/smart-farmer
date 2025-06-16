/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";

const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
  try {
    // Get the token from the request body (assuming raw text token)
    const token = await req.text();

    // Decode the token with `complete: true` to get header and payload
    const decoded = jwt.decode(token, { complete: true });

    if (
      !decoded ||
      typeof decoded === "string" ||
      !("header" in decoded)
    ) {
      // If decode failed or unexpected shape
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 400 }
      );
    }

    const header = decoded.header as JwtHeader;
    const kid = header.kid;

    if (!kid) {
      return NextResponse.json(
        { message: "Token header missing kid" },
        { status: 400 }
      );
    }

    // Get signing key
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();

    // Verify the token and get payload
    const event = jwt.verify(token, signingKey) as JwtPayload & {
      type?: string;
      data?: any;
    };

    console.log(event);

    switch (event.type) {
      case "user.updated":
        // handle user updated event
        console.log(event.data);
        break;
      case "user.created":
        // handle user created event
        console.log(event.data);
        break;
      default:
        // other events
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
  return NextResponse.json({ status: 200, statusText: "success" });
}
