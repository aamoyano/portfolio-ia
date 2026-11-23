import type { IconType } from "react-icons";
import { RiOpenaiFill } from "react-icons/ri";
import {
  SiApachespark,
  SiClaude,
  SiDocker,
  SiGit,
  SiGooglegemini,
  SiJavascript,
  SiLangchain,
  SiModelcontextprotocol,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNumpy,
  SiPandas,
  SiPhp,
  SiPython,
  SiReact,
  SiScikitlearn,
  SiWordpress,
} from "react-icons/si";
import { TbDatabaseSearch, TbSql } from "react-icons/tb";

/**
 * Iconos de tecnologías disponibles para el stack.
 * Para añadir uno nuevo: importa el icono y añádelo aquí;
 * después ya puedes usar su clave en `profile.ts`.
 */
export const techIcons = {
  python: SiPython,
  langchain: SiLangchain,
  openai: RiOpenaiFill,
  claude: SiClaude,
  gemini: SiGooglegemini,
  rag: TbDatabaseSearch,
  mcp: SiModelcontextprotocol,
  sql: TbSql,
  pandas: SiPandas,
  numpy: SiNumpy,
  sklearn: SiScikitlearn,
  spark: SiApachespark,
  mongodb: SiMongodb,
  docker: SiDocker,
  javascript: SiJavascript,
  react: SiReact,
  nextjs: SiNextdotjs,
  php: SiPhp,
  mysql: SiMysql,
  wordpress: SiWordpress,
  git: SiGit,
} satisfies Record<string, IconType>;

export type TechIconKey = keyof typeof techIcons;
