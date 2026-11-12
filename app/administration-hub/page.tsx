import type { Metadata } from 'next';
import GrantTracker from '../grant-tracker/GrantTracker';
export const metadata: Metadata = { title:'Administration Hub | Future of Music', description:'Private financials and program administration.', robots:{index:false,follow:false,nocache:true}, referrer:'no-referrer' };
export default function AdministrationHub(){return <GrantTracker/>;}
