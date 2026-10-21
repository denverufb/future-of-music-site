import type { Metadata } from 'next';
import GrantTracker from '../grant-tracker/GrantTracker';
export const metadata: Metadata = {title:'FOM Finance Hub | Future of Music',description:'Private grants and operating finance workspace.',robots:{index:false,follow:false,nocache:true}};
export default function FinanceHubPage(){return <GrantTracker/>;}
