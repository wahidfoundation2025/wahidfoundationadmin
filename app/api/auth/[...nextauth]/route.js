import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Invite from "@/lib/models/invite"; // correct if your invite model is there
import User from "@/lib/models/user";     // create this if not already
import { dbConnect } from "@/lib/dbConnect";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        await dbConnect();

        const invited = await Invite.findOne({ email: user.email });

        if (!invited) {
          console.log("❌ Not invited:", user.email);
          return false;
        }

        console.log("✅ Invited user:", user.email);

        // Mark invite as accepted
        if (!invited.accepted) {
          invited.accepted = true;
          await invited.save();
        }

        // Create user if doesn't exist
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name || "",
            image: user.image || "",
            role: invited.role,
            access: invited.access,
          });
          console.log("✅ User created:", user.email);
        }

        return true;
      } catch (err) {
        console.error("❌ Error during signIn:", err);
        return false;
      }
    },

    async session({ session }) {
      try {
        await dbConnect();

        const dbUser = await User.findOne({ email: session.user.email });

        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.access = dbUser.access;
          session.user._id = dbUser._id.toString();
        }

        return session;
      } catch (err) {
        console.error("❌ Session error:", err);
        return session;
      }
    },
  },
});

export { handler as GET, handler as POST };
