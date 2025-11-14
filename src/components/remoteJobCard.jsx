import React from 'react';
import { Card, CardFooter, CardTitle, CardHeader, CardContent } from './ui/card';
import { MapPin, Calendar, Tag, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function stripImagesAndStyles(html) {
  // Remove <img ...> tags
  let noImgs = html.replace(/<img[^>]*>/g, '');
  // Remove all style, color, bgcolor, and background attributes
  return noImgs.replace(/(style|color|bgcolor|background)="[^"]*"/gi, '');
}

const RemoteJobCard = ({ job }) => {
  return (
    <Card className="flex flex-col justify-between shadow-lg border border-slate-200 w-full max-w-md min-w-0 mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-col gap-1 font-bold text-lg">
          {job.title}
         
          
          <span className="text-base font-semibold text-slate-50">{job.company?.name}</span>
          
         
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-3 items-center mb-2 text-xs sm:text-sm ">
          <div className="flex items-center gap-1 text-slate-50">
            <MapPin size={14} /> {job.candidate_required_location || 'Remote'}
          </div>
          <div className="flex items-center gap-1 text-slate-50">
            <Tag size={14} /> {job.category || 'Other'}
          </div>
          <div className="flex items-center gap-1 text-slate-50">
            <DollarSign size={14} /> {job.salary ? job.salary : 'Salary not specified'}
          </div>
          <div className="flex items-center gap-1 text-slate-50">
            <Calendar size={14} /> {formatDate(job.publication_date)}
          </div>
        </div>
        <hr className="border-t-2 border-slate-100 my-3" />
        {/* Render description as HTML */}
      
        <div
          className="text-sm text-white bg-black p-2 rounded min-w-0 break-words"
          style={{
            color: 'white',
            background: '#000',
            opacity: 1,
            fontWeight: 400,
            maxHeight: 120,
            overflowY: 'auto',
            overflowX: 'hidden',
            wordBreak: 'break-word',
          }}
          dangerouslySetInnerHTML={{
            __html: stripImagesAndStyles(job.description),
          }}
        ></div>
    
      </CardContent>

      <CardFooter className="flex gap-7">
        <Button
          variant="green"
          className="w-full rounded-b-lg p-4"
          onClick={() => window.open(job.external_url, '_blank')}
        >
          More Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RemoteJobCard;
