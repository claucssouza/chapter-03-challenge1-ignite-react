import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <div className={commonStyles.contentContainer}>
      <p className={styles.title}>Como utilizar Hooks</p>
      <p className={styles.subtitle}>Tudo sobre como criar a sua primeira aplicação utilizando Create React App</p>
      <div className={styles.footer}>
        <span><AiOutlineCalendar/>19 abr 2021</span>
        <span><AiOutlineUser />Clau Souza</span>
      </div>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
