type ThumbnailProps = {
  name: string;
  color: string;
}

function UserThumbnail({ name, color }: ThumbnailProps) {

  return (
    <div className='h-12 w-12 text-center text-5xl uppercase mr-4' style={{ backgroundColor: color }} title={name}>
      <span>{name?.length ? name[0] : ''}</span>
    </div>
  );
}

export default UserThumbnail;
