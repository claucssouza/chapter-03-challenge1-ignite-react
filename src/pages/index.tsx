import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';


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

export default function Home(results: HomeProps) {
  const { postsPagination } = results;

  return (
    <div className={commonStyles.contentContainer}>
      {postsPagination.map(post => (
        <>
          <p className={styles.title}>{post.title}</p>
          <p className={styles.subtitle}>{post.subtitle}</p>
          <div className={styles.footer}>
            <span><AiOutlineCalendar />{post.updatedAt}</span>
            <span><AiOutlineUser />{post.author}</span>
          </div>
        </>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.uid', 'posts.first_publication_date'],
    pageSize: 10
  });

  console.log(postsResponse);

  const postsPagination = postsResponse.results.map((post: Post) => {
    return {
      slug: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      updatedAt: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  });

  return {
    props: {
      postsPagination
    }
  }
};
