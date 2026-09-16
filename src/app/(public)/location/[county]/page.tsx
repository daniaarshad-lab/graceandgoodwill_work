import { redirect } from "next/navigation";

export default function CountyRedirectPage() {
  // If a user navigates to /location/[county], redirect them to the main /location page
  // where they can browse all regions, counties, and towns.
  redirect("/location");
}
