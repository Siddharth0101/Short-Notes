export const INTERVIEW_TOPICS = [
  ['html', 'HTML'],
  ['css', 'CSS'],
  ['javascript', 'JavaScript'],
  ['react', 'React'],
  ['redux', 'Redux'],
  ['node', 'Node.js'],
  ['java', 'Java'],
  ['spring', 'Spring Boot'],
  ['mongodb', 'MongoDB'],
  ['dsa', 'DSA'],
  ['system-design', 'System design'],
].map(([id, name]) => ({ id, name }));

export function questionTopic(item) {
  if (item.topic) return item.topic;
  if (item.id === 'iq-lab-03') return 'css';
  if (item.id === 'iq-lab-04') return 'html';
  if (
    item.track === 'java' &&
    (item.tags.includes('spring') || /Spring|@Transactional|JPA/.test(item.question))
  )
    return 'spring';
  if (item.track === 'mongodb' && (item.tags.includes('node') || item.id === 'iq-lab-14'))
    return 'node';
  return item.track;
}
